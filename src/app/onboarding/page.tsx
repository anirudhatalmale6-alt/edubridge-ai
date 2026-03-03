'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { GraduationCap, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { COUNTRIES, MAJORS, US_STATES } from '@/lib/utils';

const STEPS = [
  { title: 'About You', subtitle: 'Basic identity & background' },
  { title: 'Academics', subtitle: 'Your academic profile' },
  { title: 'Study Goals', subtitle: 'Where do you want to study?' },
  { title: 'Language & Tests', subtitle: 'English and standardized tests' },
  { title: 'Finances', subtitle: 'Your financial situation' },
  { title: 'Visa & Work', subtitle: 'Visa and work plans' },
  { title: 'Support Needs', subtitle: 'How can we help you?' },
];

const SUPPORT_OPTIONS = [
  'Essay writing help',
  'CV / Resume building',
  'Document translation',
  'Cultural preparation',
  'Housing guidance',
  'Flight / travel planning',
  'Interview preparation',
  'Recommendation letter guidance',
  'Financial planning',
  'Visa process help',
];

const EXTRACURRICULAR_OPTIONS = [
  'Sports', 'Music', 'Art', 'Debate', 'Volunteering', 'Student government',
  'Research', 'Tutoring', 'Part-time work', 'Entrepreneurship', 'Religious activities',
  'Theater / Drama', 'Journalism / Writing', 'Coding / Tech clubs', 'Environmental clubs',
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    full_name: '',
    country: '',
    date_of_birth: '',
    gender: '',
    first_generation: false,
    low_income: false,
    gpa: '',
    gpa_scale: '4.0',
    intended_major: '',
    education_level: 'high_school',
    academic_strengths: '',
    extracurriculars: [] as string[],
    destination_country: 'US',
    target_start_term: 'Fall 2027',
    preferred_school_type: '',
    preferred_states: [] as string[],
    preferred_campus_size: '',
    preferred_setting: '',
    english_level: 5,
    toefl_score: '',
    ielts_score: '',
    sat_score: '',
    act_score: '',
    test_optional_preference: false,
    annual_family_income: '',
    max_annual_budget: '',
    needs_full_scholarship: false,
    willing_community_college_transfer: false,
    needs_f1_visa: true,
    plans_to_work: false,
    work_goals: '',
    support_needs: [] as string[],
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setForm(prev => ({
            ...prev,
            full_name: data.full_name || '',
            country: data.country || '',
            date_of_birth: data.date_of_birth || '',
            gender: data.gender || '',
            first_generation: data.first_generation || false,
            low_income: data.low_income || false,
            gpa: data.gpa?.toString() || '',
            gpa_scale: data.gpa_scale || '4.0',
            intended_major: data.intended_major || '',
            education_level: data.education_level || 'high_school',
            academic_strengths: data.academic_strengths || '',
            extracurriculars: data.extracurriculars || [],
            destination_country: data.destination_country || 'US',
            target_start_term: data.target_start_term || 'Fall 2027',
            preferred_school_type: data.preferred_school_type || '',
            preferred_states: data.preferred_states || [],
            preferred_campus_size: data.preferred_campus_size || '',
            preferred_setting: data.preferred_setting || '',
            english_level: data.english_level || 5,
            toefl_score: data.toefl_score?.toString() || '',
            ielts_score: data.ielts_score?.toString() || '',
            sat_score: data.sat_score?.toString() || '',
            act_score: data.act_score?.toString() || '',
            test_optional_preference: data.test_optional_preference || false,
            annual_family_income: data.annual_family_income || '',
            max_annual_budget: data.max_annual_budget?.toString() || '',
            needs_full_scholarship: data.needs_full_scholarship || false,
            willing_community_college_transfer: data.willing_community_college_transfer || false,
            needs_f1_visa: data.needs_f1_visa ?? true,
            plans_to_work: data.plans_to_work || false,
            work_goals: data.work_goals || '',
            support_needs: data.support_needs || [],
          }));
        }
      }
      setLoading(false);
    };
    loadProfile();
  }, [supabase]);

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setForm(prev => {
      const arr = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
      };
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profileData = {
      full_name: form.full_name,
      country: form.country,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      first_generation: form.first_generation,
      low_income: form.low_income,
      gpa: form.gpa ? parseFloat(form.gpa) : null,
      gpa_scale: form.gpa_scale,
      intended_major: form.intended_major || null,
      education_level: form.education_level,
      academic_strengths: form.academic_strengths || null,
      extracurriculars: form.extracurriculars.length > 0 ? form.extracurriculars : null,
      destination_country: form.destination_country,
      target_start_term: form.target_start_term || null,
      preferred_school_type: form.preferred_school_type || null,
      preferred_states: form.preferred_states.length > 0 ? form.preferred_states : null,
      preferred_campus_size: form.preferred_campus_size || null,
      preferred_setting: form.preferred_setting || null,
      english_level: form.english_level,
      toefl_score: form.toefl_score ? parseInt(form.toefl_score) : null,
      ielts_score: form.ielts_score ? parseFloat(form.ielts_score) : null,
      sat_score: form.sat_score ? parseInt(form.sat_score) : null,
      act_score: form.act_score ? parseInt(form.act_score) : null,
      test_optional_preference: form.test_optional_preference,
      annual_family_income: form.annual_family_income || null,
      max_annual_budget: form.max_annual_budget ? parseInt(form.max_annual_budget) : null,
      needs_full_scholarship: form.needs_full_scholarship,
      willing_community_college_transfer: form.willing_community_college_transfer,
      needs_f1_visa: form.needs_f1_visa,
      plans_to_work: form.plans_to_work,
      work_goals: form.work_goals || null,
      support_needs: form.support_needs.length > 0 ? form.support_needs : null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    await supabase.from('profiles').update(profileData).eq('id', user.id);
    setSaving(false);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-blue-50">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-brand-900">EduBridge AI</span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-sm text-gray-500">Profile Setup</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i < step ? 'bg-brand-600 text-white' :
                  i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-1 ${i < step ? 'bg-brand-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{STEPS[step].title}</h2>
          <p className="text-gray-500 text-sm">{STEPS[step].subtitle}</p>
        </div>

        {/* Form Steps */}
        <div className="card p-6 sm:p-8">
          {/* Step 0: About You */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" className="input-field" value={form.full_name}
                  onChange={e => updateField('full_name', e.target.value)} placeholder="Your full name" required />
              </div>
              <div>
                <label className="label">Country of Residence *</label>
                <select className="select-field" value={form.country}
                  onChange={e => updateField('country', e.target.value)} required>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Date of Birth</label>
                  <input type="date" className="input-field" value={form.date_of_birth}
                    onChange={e => updateField('date_of_birth', e.target.value)} />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="select-field" value={form.gender}
                    onChange={e => updateField('gender', e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    checked={form.first_generation}
                    onChange={e => updateField('first_generation', e.target.checked)} />
                  <div>
                    <span className="text-sm font-medium text-gray-900">I am a first-generation college student</span>
                    <p className="text-xs text-gray-500">Neither of your parents completed a 4-year college degree</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    checked={form.low_income}
                    onChange={e => updateField('low_income', e.target.checked)} />
                  <div>
                    <span className="text-sm font-medium text-gray-900">My family has limited income</span>
                    <p className="text-xs text-gray-500">This helps us find need-based scholarships for you</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Academics */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Your GPA</label>
                  <input type="number" step="0.01" className="input-field" value={form.gpa}
                    onChange={e => updateField('gpa', e.target.value)} placeholder="e.g. 3.50" />
                </div>
                <div>
                  <label className="label">GPA Scale</label>
                  <select className="select-field" value={form.gpa_scale}
                    onChange={e => updateField('gpa_scale', e.target.value)}>
                    <option value="4.0">0 - 4.0 scale</option>
                    <option value="5.0">0 - 5.0 scale</option>
                    <option value="10.0">0 - 10.0 scale</option>
                    <option value="percentage">Percentage (0-100%)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Intended Major / Area of Study</label>
                <select className="select-field" value={form.intended_major}
                  onChange={e => updateField('intended_major', e.target.value)}>
                  <option value="">Select a major (or Undecided)</option>
                  {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Current Education Level</label>
                <select className="select-field" value={form.education_level}
                  onChange={e => updateField('education_level', e.target.value)}>
                  <option value="high_school">High School Student</option>
                  <option value="high_school_graduate">High School Graduate</option>
                  <option value="community_college">Community College Student</option>
                  <option value="bachelors">Pursuing Bachelor&apos;s Degree</option>
                  <option value="bachelors_graduate">Bachelor&apos;s Graduate</option>
                  <option value="masters">Pursuing Master&apos;s Degree</option>
                </select>
              </div>
              <div>
                <label className="label">Academic Strengths & Achievements</label>
                <textarea className="input-field" rows={3} value={form.academic_strengths}
                  onChange={e => updateField('academic_strengths', e.target.value)}
                  placeholder="e.g. Won national math olympiad, top 5% of class, published a research paper..." />
              </div>
              <div>
                <label className="label">Extracurricular Activities</label>
                <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {EXTRACURRICULAR_OPTIONS.map(item => (
                    <button key={item} type="button"
                      onClick={() => toggleArrayItem('extracurriculars', item)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        form.extracurriculars.includes(item)
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Study Goals */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="label">Destination Country</label>
                <select className="select-field" value={form.destination_country}
                  onChange={e => updateField('destination_country', e.target.value)}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div>
                <label className="label">Target Start Term</label>
                <select className="select-field" value={form.target_start_term}
                  onChange={e => updateField('target_start_term', e.target.value)}>
                  <option value="Fall 2026">Fall 2026</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Fall 2027">Fall 2027</option>
                  <option value="Spring 2028">Spring 2028</option>
                  <option value="Fall 2028">Fall 2028</option>
                </select>
              </div>
              <div>
                <label className="label">Preferred School Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'university', label: 'University (4-year degree)', desc: 'Start at a university directly' },
                    { value: 'community_college', label: 'Community College → Transfer', desc: 'Start at a cheaper 2-year college, then transfer' },
                    { value: 'either', label: 'Open to both options', desc: 'Let me see all possibilities' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.preferred_school_type === opt.value ? 'border-brand-300 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input type="radio" name="school_type" value={opt.value}
                        checked={form.preferred_school_type === opt.value}
                        onChange={e => updateField('preferred_school_type', e.target.value)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Preferred Campus Size</label>
                <select className="select-field" value={form.preferred_campus_size}
                  onChange={e => updateField('preferred_campus_size', e.target.value)}>
                  <option value="">No preference</option>
                  <option value="small">Small (under 5,000 students)</option>
                  <option value="medium">Medium (5,000 - 20,000)</option>
                  <option value="large">Large (over 20,000)</option>
                </select>
              </div>
              <div>
                <label className="label">Preferred Campus Setting</label>
                <select className="select-field" value={form.preferred_setting}
                  onChange={e => updateField('preferred_setting', e.target.value)}>
                  <option value="">No preference</option>
                  <option value="urban">Urban (big city)</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural / Small town</option>
                </select>
              </div>
              <div>
                <label className="label">Preferred US States (optional)</label>
                <p className="text-xs text-gray-500 mb-2">Select any states you&apos;re interested in</p>
                <div className="flex flex-wrap gap-1.5">
                  {US_STATES.map(state => (
                    <button key={state} type="button"
                      onClick={() => toggleArrayItem('preferred_states', state)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        form.preferred_states.includes(state)
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}>
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Language & Tests */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="label">English Level Self-Assessment (1-10)</label>
                <p className="text-xs text-gray-500 mb-2">1 = Beginner, 5 = Intermediate, 10 = Native/Fluent</p>
                <input type="range" min="1" max="10" value={form.english_level}
                  onChange={e => updateField('english_level', parseInt(e.target.value))}
                  className="w-full accent-brand-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Beginner</span>
                  <span className="text-brand-600 font-medium">{form.english_level}/10</span>
                  <span>Fluent</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">TOEFL Score</label>
                  <input type="number" className="input-field" value={form.toefl_score}
                    onChange={e => updateField('toefl_score', e.target.value)}
                    placeholder="0 - 120 (leave blank if not taken)" min="0" max="120" />
                </div>
                <div>
                  <label className="label">IELTS Score</label>
                  <input type="number" step="0.5" className="input-field" value={form.ielts_score}
                    onChange={e => updateField('ielts_score', e.target.value)}
                    placeholder="0.0 - 9.0 (leave blank if not taken)" min="0" max="9" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">SAT Score</label>
                  <input type="number" className="input-field" value={form.sat_score}
                    onChange={e => updateField('sat_score', e.target.value)}
                    placeholder="400 - 1600 (leave blank if not taken)" min="400" max="1600" />
                </div>
                <div>
                  <label className="label">ACT Score</label>
                  <input type="number" className="input-field" value={form.act_score}
                    onChange={e => updateField('act_score', e.target.value)}
                    placeholder="1 - 36 (leave blank if not taken)" min="1" max="36" />
                </div>
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  checked={form.test_optional_preference}
                  onChange={e => updateField('test_optional_preference', e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900">I prefer test-optional schools</span>
                  <p className="text-xs text-gray-500">Many US schools no longer require SAT/ACT scores</p>
                </div>
              </label>
            </div>
          )}

          {/* Step 4: Finances */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="label">Approximate Annual Family Income (USD)</label>
                <select className="select-field" value={form.annual_family_income}
                  onChange={e => updateField('annual_family_income', e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="under_5k">Under $5,000</option>
                  <option value="5k_10k">$5,000 - $10,000</option>
                  <option value="10k_20k">$10,000 - $20,000</option>
                  <option value="20k_40k">$20,000 - $40,000</option>
                  <option value="40k_60k">$40,000 - $60,000</option>
                  <option value="60k_plus">Over $60,000</option>
                </select>
              </div>
              <div>
                <label className="label">Maximum Annual Budget for Education (USD)</label>
                <p className="text-xs text-gray-500 mb-1">How much can your family pay per year for tuition + living?</p>
                <input type="number" className="input-field" value={form.max_annual_budget}
                  onChange={e => updateField('max_annual_budget', e.target.value)}
                  placeholder="e.g. 15000" />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  checked={form.needs_full_scholarship}
                  onChange={e => updateField('needs_full_scholarship', e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900">I need a full scholarship</span>
                  <p className="text-xs text-gray-500">I cannot afford any tuition without full financial support</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  checked={form.willing_community_college_transfer}
                  onChange={e => updateField('willing_community_college_transfer', e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900">I&apos;m open to community college → transfer pathway</span>
                  <p className="text-xs text-gray-500">This can save 50-70% on the first two years of education</p>
                </div>
              </label>
            </div>
          )}

          {/* Step 5: Visa & Work */}
          {step === 5 && (
            <div className="space-y-5">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  checked={form.needs_f1_visa}
                  onChange={e => updateField('needs_f1_visa', e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900">I will need an F-1 student visa</span>
                  <p className="text-xs text-gray-500">Required for most international students studying in the US</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  checked={form.plans_to_work}
                  onChange={e => updateField('plans_to_work', e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900">I plan to work while studying</span>
                  <p className="text-xs text-gray-500">F-1 students can work up to 20 hours/week on campus</p>
                </div>
              </label>
              {form.plans_to_work && (
                <div>
                  <label className="label">Work Goals</label>
                  <select className="select-field" value={form.work_goals}
                    onChange={e => updateField('work_goals', e.target.value)}>
                    <option value="">Select your primary goal</option>
                    <option value="on_campus">On-campus work only</option>
                    <option value="internships">Internships in my field</option>
                    <option value="cpt">Curricular Practical Training (CPT)</option>
                    <option value="opt">Optional Practical Training (OPT) after graduation</option>
                    <option value="any">Open to any work opportunities</option>
                  </select>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-1">About working in the US</h4>
                <p className="text-xs text-blue-700">
                  F-1 students can work on campus (up to 20 hrs/week during school, full-time during breaks).
                  After the first year, you may qualify for off-campus work through CPT or OPT programs.
                  Our AI advisor will help you understand all your options.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Support Needs */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <label className="label">What kind of help do you need?</label>
                <p className="text-xs text-gray-500 mb-3">Select all areas where you&apos;d like guidance from EduBridge AI</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUPPORT_OPTIONS.map(item => (
                    <label key={item} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.support_needs.includes(item) ? 'border-brand-300 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                        checked={form.support_needs.includes(item)}
                        onChange={() => toggleArrayItem('support_needs', item)} />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-accent-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-accent-600 mb-1">You&apos;re almost done!</h4>
                <p className="text-xs text-gray-600">
                  After completing your profile, our AI will analyze your information and provide personalized
                  university and scholarship recommendations. You can always update your profile later.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-ghost flex items-center gap-1 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="btn-primary flex items-center gap-1"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Profile <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
