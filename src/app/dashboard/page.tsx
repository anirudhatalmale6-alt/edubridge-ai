'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  GraduationCap, Award, Sparkles, MessageCircle, TrendingUp,
  DollarSign, Target, ArrowRight, BookOpen
} from 'lucide-react';
import { formatCurrency, getMatchColor } from '@/lib/utils';
import type { Profile, University, Scholarship, SavedMatch } from '@/types';

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, uniRes, scholRes, matchRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('universities').select('*').limit(6).order('us_news_rank', { ascending: true, nullsFirst: false }),
        supabase.from('scholarships').select('*').limit(6).order('amount_max', { ascending: false, nullsFirst: false }),
        supabase.from('saved_matches').select('*, university:universities(*), scholarship:scholarships(*)').eq('user_id', user.id).order('match_score', { ascending: false }).limit(5),
      ]);

      setProfile(profileRes.data as Profile);
      setUniversities(uniRes.data as University[] || []);
      setScholarships(scholRes.data as Scholarship[] || []);
      setMatches(matchRes.data as SavedMatch[] || []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your personalized study abroad overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{universities.length > 0 ? '100+' : '0'}</p>
              <p className="text-xs text-gray-500">Universities</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scholarships.length > 0 ? '75+' : '0'}</p>
              <p className="text-xs text-gray-500">Scholarships</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
              <p className="text-xs text-gray-500">AI Matches</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.max_annual_budget ? formatCurrency(profile.max_annual_budget) : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Your Budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/matches" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                Get AI Recommendations
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Our AI analyzes your profile to find the best university and scholarship matches for you.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 mt-3">
                Find matches <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/chat" className="card p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Chat with AI Advisor
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Get help with essays, applications, visa questions, financial planning, and more.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 mt-3">
                Start chatting <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Top Matches */}
      {matches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Top Matches</h2>
            <Link href="/dashboard/matches" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map(match => (
              <div key={match.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {match.university?.name || match.scholarship?.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMatchColor(match.match_score)}`}>
                    {match.match_score}%
                  </span>
                </div>
                {match.match_reasons?.slice(0, 2).map((reason, i) => (
                  <p key={i} className="text-xs text-gray-500 flex items-start gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 mt-0.5 text-emerald-500 flex-shrink-0" />
                    {reason}
                  </p>
                ))}
                {match.estimated_net_cost && (
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    Est. net cost: {formatCurrency(match.estimated_net_cost)}/year
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Universities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Featured Universities</h2>
          <Link href="/dashboard/universities" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.slice(0, 6).map(uni => (
            <Link key={uni.id} href={`/dashboard/universities/${uni.id}`} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{uni.name}</h3>
                  <p className="text-xs text-gray-500">{uni.city}, {uni.state}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {uni.acceptance_rate && <span>{uni.acceptance_rate}% accept</span>}
                    {uni.tuition_international && <span>{formatCurrency(uni.tuition_international)}/yr</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Top Scholarships</h2>
          <Link href="/dashboard/scholarships" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholarships.slice(0, 6).map(s => (
            <Link key={s.id} href={`/dashboard/scholarships/${s.id}`} className="card p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 text-sm">{s.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.provider}</p>
              <div className="flex items-center gap-2 mt-2">
                {s.amount_max && (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Up to {formatCurrency(s.amount_max)}
                  </span>
                )}
                {s.covers_tuition && (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Full tuition</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
