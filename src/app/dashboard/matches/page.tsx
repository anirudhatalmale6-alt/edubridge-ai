'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sparkles, GraduationCap, Award, TrendingUp, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency, getMatchColor, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import type { SavedMatch, MatchResult } from '@/types';

export default function MatchesPage() {
  const supabase = createClient();
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('saved_matches')
      .select('*, university:universities(*), scholarship:scholarships(*)')
      .eq('user_id', user.id)
      .order('match_score', { ascending: false });

    setMatches(data as SavedMatch[] || []);
    setLoading(false);
  };

  const generateMatches = async () => {
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/match', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate matches');
      }

      const result: MatchResult = await res.json();
      setSummary(result.summary || '');
      await loadMatches();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }

    setGenerating(false);
  };

  const uniMatches = matches.filter(m => m.university_id);
  const scholMatches = matches.filter(m => m.scholarship_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Matches</h1>
          <p className="text-gray-500 mt-1">Personalized university and scholarship recommendations based on your profile.</p>
        </div>
        <button onClick={generateMatches} disabled={generating}
          className="btn-primary flex items-center gap-2">
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              {matches.length > 0 ? 'Refresh Matches' : 'Generate Matches'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">Could not generate matches</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="card p-5 mb-6 bg-gradient-to-r from-brand-50 to-blue-50 border-brand-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-brand-900 text-sm">AI Summary</h3>
              <p className="text-sm text-gray-700 mt-1">{summary}</p>
            </div>
          </div>
        </div>
      )}

      {matches.length === 0 && !generating && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-brand-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No matches yet</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Click &ldquo;Generate Matches&rdquo; to let our AI analyze your profile and find the best universities and scholarships for you.
          </p>
        </div>
      )}

      {/* University Matches */}
      {uniMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" /> University Matches ({uniMatches.length})
          </h2>
          <div className="space-y-3">
            {uniMatches.map(match => (
              <Link key={match.id} href={`/dashboard/universities/${match.university_id}`}
                className="card p-5 hover:shadow-md transition-shadow block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{match.university?.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getMatchColor(match.match_score)}`}>
                        {match.match_score}% match
                      </span>
                      {match.difficulty_level && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(match.difficulty_level)}`}>
                          {getDifficultyLabel(match.difficulty_level)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {match.university?.city}, {match.university?.state} · {match.university?.type?.replace(/_/g, ' ')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.match_reasons?.map((reason, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <TrendingUp className="w-3 h-3 text-emerald-500" /> {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  {match.estimated_net_cost && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">Est. net cost</p>
                      <p className="text-lg font-bold text-brand-600 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(match.estimated_net_cost)}
                      </p>
                      <p className="text-xs text-gray-400">/year</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Scholarship Matches */}
      {scholMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Scholarship Matches ({scholMatches.length})
          </h2>
          <div className="space-y-3">
            {scholMatches.map(match => (
              <Link key={match.id} href={`/dashboard/scholarships/${match.scholarship_id}`}
                className="card p-5 hover:shadow-md transition-shadow block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{match.scholarship?.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getMatchColor(match.match_score)}`}>
                        {match.match_score}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{match.scholarship?.provider}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.match_reasons?.map((reason, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <TrendingUp className="w-3 h-3 text-emerald-500" /> {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  {match.scholarship?.amount_max && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">Up to</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(match.scholarship.amount_max)}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
