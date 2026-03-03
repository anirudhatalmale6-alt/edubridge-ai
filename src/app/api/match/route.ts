import { createClient } from '@/lib/supabase/server';
import { getOpenAI } from '@/lib/openai';
import { MATCHING_SYSTEM_PROMPT } from '@/lib/prompts';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Pre-filter universities
    let uniQuery = supabase.from('universities').select('*');

    // Budget filter (allow 1.5x budget to account for aid)
    if (profile.max_annual_budget) {
      uniQuery = uniQuery.or(`tuition_international.is.null,tuition_international.lte.${Math.round(profile.max_annual_budget * 1.5)}`);
    }

    // Include community colleges if student is open to it
    if (!profile.willing_community_college_transfer) {
      uniQuery = uniQuery.neq('type', 'community_college');
    }

    const { data: universities } = await uniQuery.limit(60);

    // Pre-filter scholarships
    let scholQuery = supabase.from('scholarships').select('*');

    if (profile.education_level) {
      scholQuery = scholQuery.or(`education_level.is.null,education_level.cs.{${profile.education_level}}`);
    }

    const { data: scholarships } = await scholQuery.limit(60);

    // Call OpenAI for intelligent matching
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: MATCHING_SYSTEM_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            student_profile: {
              country: profile.country,
              gpa: profile.gpa,
              gpa_scale: profile.gpa_scale,
              intended_major: profile.intended_major,
              education_level: profile.education_level,
              first_generation: profile.first_generation,
              low_income: profile.low_income,
              sat_score: profile.sat_score,
              act_score: profile.act_score,
              toefl_score: profile.toefl_score,
              ielts_score: profile.ielts_score,
              english_level: profile.english_level,
              test_optional_preference: profile.test_optional_preference,
              max_annual_budget: profile.max_annual_budget,
              needs_full_scholarship: profile.needs_full_scholarship,
              willing_community_college_transfer: profile.willing_community_college_transfer,
              preferred_states: profile.preferred_states,
              preferred_campus_size: profile.preferred_campus_size,
              preferred_setting: profile.preferred_setting,
              extracurriculars: profile.extracurriculars,
            },
            universities: (universities || []).map(u => ({
              id: u.id,
              name: u.name,
              state: u.state,
              type: u.type,
              acceptance_rate: u.acceptance_rate,
              avg_sat: u.avg_sat,
              avg_act: u.avg_act,
              min_toefl: u.min_toefl,
              min_ielts: u.min_ielts,
              tuition_international: u.tuition_international,
              estimated_total_cost: u.estimated_total_cost,
              avg_financial_aid: u.avg_financial_aid,
              international_aid_available: u.international_aid_available,
              merit_scholarships_available: u.merit_scholarships_available,
              need_blind_international: u.need_blind_international,
              test_optional: u.test_optional,
              popular_majors: u.popular_majors,
              campus_setting: u.campus_setting,
            })),
            scholarships: (scholarships || []).map(s => ({
              id: s.id,
              name: s.name,
              type: s.type,
              amount_min: s.amount_min,
              amount_max: s.amount_max,
              covers_tuition: s.covers_tuition,
              covers_living: s.covers_living,
              eligible_countries: s.eligible_countries,
              eligible_majors: s.eligible_majors,
              min_gpa: s.min_gpa,
              income_requirement: s.income_requirement,
              first_gen_only: s.first_gen_only,
              university_id: s.university_id,
            })),
          }),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 3000,
    });

    const matchResult = JSON.parse(response.choices[0].message.content || '{}');

    // Save matches to database
    const matchRows = [
      ...(matchResult.university_matches || []).map((m: { id: number; score: number; reasons: string[]; estimated_net_cost: number; difficulty_level: string }) => ({
        user_id: user.id,
        university_id: m.id,
        match_score: m.score,
        match_reasons: m.reasons,
        estimated_net_cost: m.estimated_net_cost,
        difficulty_level: m.difficulty_level,
        status: 'recommended',
      })),
      ...(matchResult.scholarship_matches || []).map((m: { id: number; score: number; reasons: string[] }) => ({
        user_id: user.id,
        scholarship_id: m.id,
        match_score: m.score,
        match_reasons: m.reasons,
        status: 'recommended',
      })),
    ];

    // Clear previous matches and insert new ones
    await supabase.from('saved_matches').delete().eq('user_id', user.id).eq('status', 'recommended');

    if (matchRows.length > 0) {
      await supabase.from('saved_matches').insert(matchRows);
    }

    return NextResponse.json(matchResult);
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json(
      { error: 'Failed to generate matches. Please check your OpenAI API key.' },
      { status: 500 }
    );
  }
}
