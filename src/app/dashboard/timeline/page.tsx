'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar, CheckCircle2, Circle, Clock, FileText, GraduationCap,
  Languages, DollarSign, Plane, BookOpen
} from 'lucide-react';
import type { Profile } from '@/types';

interface TimelineItem {
  id: string;
  month: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tasks: string[];
}

function generateTimeline(profile: Profile | null): TimelineItem[] {
  const targetTerm = profile?.target_start_term || 'Fall 2027';
  const isFall = targetTerm.includes('Fall');
  const year = parseInt(targetTerm.split(' ')[1]) || 2027;
  const startYear = year - 1;

  const items: TimelineItem[] = [];

  // Research Phase
  items.push({
    id: 'research',
    month: `${isFall ? 'Jun' : 'Jan'} ${startYear}`,
    title: 'Research & Preparation',
    description: 'Start your university and scholarship research',
    icon: BookOpen,
    color: 'blue',
    tasks: [
      'Complete your EduBridge AI profile',
      'Use AI Matches to find recommended universities',
      'Research 8-12 universities (mix of reach, match, safety)',
      'Start building your scholarship list',
      'Begin test preparation (TOEFL/IELTS, SAT/ACT if needed)',
    ],
  });

  // Test Prep
  if (profile?.english_level && profile.english_level < 8) {
    items.push({
      id: 'tests',
      month: `${isFall ? 'Jul-Sep' : 'Feb-Apr'} ${startYear}`,
      title: 'Language & Test Preparation',
      description: 'Take required standardized tests',
      icon: Languages,
      color: 'purple',
      tasks: [
        profile.toefl_score ? 'Retake TOEFL for a higher score (if needed)' : 'Register for and take TOEFL or IELTS',
        ...(profile.test_optional_preference ? [] : ['Take SAT or ACT (if required by your target schools)']),
        'Ask your AI Advisor for a personalized study plan',
        'Aim for target scores based on your university list',
      ],
    });
  }

  // Application Prep
  items.push({
    id: 'prep',
    month: `${isFall ? 'Aug-Sep' : 'Mar-Apr'} ${startYear}`,
    title: 'Application Preparation',
    description: 'Gather documents and start writing',
    icon: FileText,
    color: 'amber',
    tasks: [
      'Create your Common App account',
      'Request official transcripts from your school',
      'Ask 2-3 teachers for recommendation letters',
      'Start drafting your personal essay',
      'Gather financial documents (bank statements, income proof)',
      'Get your passport ready (or renewed)',
    ],
  });

  // Early Applications
  items.push({
    id: 'early',
    month: `${isFall ? 'Oct-Nov' : 'May-Jun'} ${startYear}`,
    title: 'Early Applications',
    description: 'Submit early decision/action applications',
    icon: GraduationCap,
    color: 'emerald',
    tasks: [
      'Finalize your personal essay (use AI Advisor for review)',
      'Submit Early Decision/Early Action applications (Nov 1-15 deadlines)',
      'Apply for early scholarship deadlines',
      'Send SAT/ACT and TOEFL/IELTS scores to universities',
      'Complete CSS Profile for financial aid (if applicable)',
    ],
  });

  // Regular Applications
  items.push({
    id: 'regular',
    month: `${isFall ? 'Dec-Jan' : 'Jul-Aug'} ${startYear}/${year}`,
    title: 'Regular Applications',
    description: 'Submit remaining applications',
    icon: Calendar,
    color: 'blue',
    tasks: [
      'Submit Regular Decision applications (Jan 1-15 deadlines)',
      'Apply for remaining scholarships',
      'Complete FAFSA (if eligible)',
      'Submit all financial aid applications',
      'Follow up on recommendation letters',
    ],
  });

  // Financial Aid
  items.push({
    id: 'financial',
    month: `${isFall ? 'Feb-Mar' : 'Sep-Oct'} ${year}`,
    title: 'Financial Aid & Decisions',
    description: 'Review offers and make your decision',
    icon: DollarSign,
    color: 'emerald',
    tasks: [
      'Receive admission decisions (March-April)',
      'Compare financial aid packages',
      'Use AI Advisor to compare net costs',
      'Negotiate financial aid if possible',
      'Commit to your chosen university (May 1 deadline for fall)',
      'Pay enrollment deposit',
    ],
  });

  // Visa & Travel
  items.push({
    id: 'visa',
    month: `${isFall ? 'Apr-Jul' : 'Nov-Jan'} ${year}`,
    title: 'Visa & Travel Preparation',
    description: 'Get your visa and prepare to travel',
    icon: Plane,
    color: 'purple',
    tasks: [
      'Receive I-20 form from your university',
      'Pay SEVIS fee',
      'Schedule and attend visa interview at US embassy',
      'Book your flight',
      'Arrange housing (dorm or off-campus)',
      'Get health insurance (check university requirements)',
      'Open a US bank account (some can be done online)',
      'Pack and prepare for departure',
    ],
  });

  return items;
}

export default function TimelinePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data as Profile);
      // Load completed tasks from localStorage
      const saved = localStorage.getItem(`timeline_${user.id}`);
      if (saved) setCompletedTasks(new Set(JSON.parse(saved)));
      setLoading(false);
    };
    load();
  }, [supabase]);

  const toggleTask = async (taskId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      localStorage.setItem(`timeline_${user.id}`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const timeline = generateTimeline(profile);
  const totalTasks = timeline.reduce((sum, item) => sum + item.tasks.length, 0);
  const completedCount = completedTasks.size;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Application Timeline</h1>
        <p className="text-gray-500 mt-1">
          Your personalized roadmap for {profile?.target_start_term || 'Fall 2027'} enrollment.
        </p>
      </div>

      {/* Progress */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-brand-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-brand-600 rounded-full h-3 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{completedCount} of {totalTasks} tasks completed</p>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {timeline.map((item, idx) => {
          const Icon = item.icon;
          const sectionTasks = item.tasks.map((t, ti) => `${item.id}-${ti}`);
          const sectionCompleted = sectionTasks.filter(t => completedTasks.has(t)).length;
          const allDone = sectionCompleted === item.tasks.length;

          return (
            <div key={item.id} className="relative">
              {/* Connector line */}
              {idx < timeline.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="card p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    allDone ? 'bg-emerald-100' : `bg-${item.color}-50`
                  }`}>
                    {allDone
                      ? <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      : <Icon className={`w-6 h-6 text-${item.color}-600`} />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.month}
                      </span>
                      <span className="text-xs text-gray-400">
                        {sectionCompleted}/{item.tasks.length} done
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.description}</p>

                    <div className="space-y-2">
                      {item.tasks.map((task, ti) => {
                        const taskId = `${item.id}-${ti}`;
                        const done = completedTasks.has(taskId);
                        return (
                          <button key={taskId} onClick={() => toggleTask(taskId)}
                            className="flex items-start gap-2 w-full text-left group">
                            {done
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              : <Circle className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0 group-hover:text-brand-400" />
                            }
                            <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                              {task}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
