import { createClient } from '@/lib/supabase/server';
import { getOpenAI } from '@/lib/openai';
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    // Get student profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const profileContext = profile ? `
Student Profile:
- Name: ${profile.full_name}
- Country: ${profile.country}
- Education: ${profile.education_level}
- GPA: ${profile.gpa} (${profile.gpa_scale} scale)
- Intended Major: ${profile.intended_major || 'Undecided'}
- First Generation: ${profile.first_generation ? 'Yes' : 'No'}
- Low Income: ${profile.low_income ? 'Yes' : 'No'}
- TOEFL: ${profile.toefl_score || 'Not taken'}
- IELTS: ${profile.ielts_score || 'Not taken'}
- SAT: ${profile.sat_score || 'Not taken'}
- ACT: ${profile.act_score || 'Not taken'}
- English Level: ${profile.english_level}/10
- Test Optional Preference: ${profile.test_optional_preference ? 'Yes' : 'No'}
- Annual Budget: $${profile.max_annual_budget || 'Not specified'}
- Needs Full Scholarship: ${profile.needs_full_scholarship ? 'Yes' : 'No'}
- Open to Community College Transfer: ${profile.willing_community_college_transfer ? 'Yes' : 'No'}
- Needs F-1 Visa: ${profile.needs_f1_visa ? 'Yes' : 'No'}
- Plans to Work: ${profile.plans_to_work ? 'Yes' : 'No'}
- Work Goals: ${profile.work_goals || 'Not specified'}
- Support Needs: ${profile.support_needs?.join(', ') || 'Not specified'}
- Target Term: ${profile.target_start_term || 'Not specified'}
- Preferred States: ${profile.preferred_states?.join(', ') || 'No preference'}
- Preferred Setting: ${profile.preferred_setting || 'No preference'}` : '';

    // Save user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: lastUserMessage.content,
      });
    }

    const stream = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT + '\n\n' + profileContext },
        ...messages.slice(-20), // Keep last 20 messages for context
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    let fullResponse = '';

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Save assistant response
        if (fullResponse) {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            role: 'assistant',
            content: fullResponse,
          });
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Chat error:', error?.message || error);
    const key = process.env.OPENAI_API_KEY;
    const keyInfo = key ? `key set (${key.substring(0, 8)}...${key.substring(key.length - 4)})` : 'key NOT set';
    console.error('OpenAI config:', keyInfo);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error', keyStatus: key ? 'set' : 'missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
