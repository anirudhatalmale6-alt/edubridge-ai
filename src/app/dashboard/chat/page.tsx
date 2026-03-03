'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, Sparkles, User, Trash2, Lightbulb } from 'lucide-react';
import type { ChatMessage } from '@/types';

const SUGGESTED_QUESTIONS = [
  "What scholarships am I eligible for?",
  "Help me write my personal statement",
  "Explain the F-1 visa process step by step",
  "Create a TOEFL study plan for me",
  "What are the cheapest US universities for international students?",
  "Help me create an application timeline",
  "How does the community college transfer pathway work?",
  "What documents do I need for my application?",
];

export default function ChatPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100);

    setMessages(data as ChatMessage[] || []);
    setLoading(false);
  };

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || streaming) return;

    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setStreaming(true);

    // Add empty assistant message for streaming
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullResponse += text;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please make sure the OpenAI API key is configured correctly and try again.',
        };
        return updated;
      });
    }

    setStreaming(false);
    inputRef.current?.focus();
  };

  const clearChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('chat_messages').delete().eq('user_id', user.id);
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-600" /> AI Advisor
          </h1>
          <p className="text-sm text-gray-500">Ask me anything about studying abroad, applications, scholarships, visas, and more.</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-ghost text-sm flex items-center gap-1 text-gray-400">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar card p-4 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Hi! I&apos;m your EduBridge AI Advisor</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md">
              I can help you with university applications, essay writing, scholarship search,
              visa guidance, test preparation, financial planning, and more.
            </p>
            <div className="mt-6 w-full max-w-lg">
              <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Try asking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-left text-xs text-gray-600 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 p-3 rounded-lg transition-colors border border-gray-100">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-brand-100' : 'bg-gradient-to-br from-brand-500 to-brand-700'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-4 h-4 text-brand-700" />
                    : <Sparkles className="w-4 h-4 text-white" />
                  }
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-md'
                    : 'bg-gray-100 text-gray-800 rounded-tl-md'
                }`}>
                  {msg.content || (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="card p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about studying abroad..."
            rows={1}
            className="flex-1 resize-none input-field !py-3 !rounded-xl"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            className="btn-primary !p-3 !rounded-xl disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
