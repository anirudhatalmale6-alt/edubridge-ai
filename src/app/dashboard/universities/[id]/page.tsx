'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Users, DollarSign, GraduationCap, Globe,
  Award, BookOpen, Building2, TrendingUp, ExternalLink, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { University, Scholarship } from '@/types';

export default function UniversityDetailPage() {
  const { id } = useParams();
  const supabase = createClient();
  const [uni, setUni] = useState<University | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [uniRes, scholRes] = await Promise.all([
        supabase.from('universities').select('*').eq('id', id).single(),
        supabase.from('scholarships').select('*').eq('university_id', id),
      ]);
      setUni(uniRes.data as University);
      setScholarships(scholRes.data as Scholarship[] || []);
      setLoading(false);
    };
    load();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!uni) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">University not found.</p>
        <Link href="/dashboard/universities" className="text-brand-600 text-sm mt-2 inline-block">Back to universities</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/universities" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to universities
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-8 h-8 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{uni.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" /> {uni.city}, {uni.state}
                  <span>·</span>
                  <span className="capitalize">{uni.type.replace(/_/g, ' ')}</span>
                  {uni.us_news_rank && <span>· US News #{uni.us_news_rank}</span>}
                </div>
              </div>
              {uni.website && (
                <a href={uni.website} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-sm flex items-center gap-1">
                  Visit Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">{uni.description}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <Users className="w-5 h-5 text-brand-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{uni.acceptance_rate != null ? `${uni.acceptance_rate}%` : 'N/A'}</p>
          <p className="text-xs text-gray-500">Acceptance Rate</p>
        </div>
        <div className="card p-4 text-center">
          <Building2 className="w-5 h-5 text-brand-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{uni.total_enrollment?.toLocaleString() || 'N/A'}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
        <div className="card p-4 text-center">
          <Globe className="w-5 h-5 text-brand-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{uni.international_student_pct != null ? `${uni.international_student_pct}%` : 'N/A'}</p>
          <p className="text-xs text-gray-500">International Students</p>
        </div>
        <div className="card p-4 text-center">
          <BookOpen className="w-5 h-5 text-brand-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{uni.student_faculty_ratio || 'N/A'}</p>
          <p className="text-xs text-gray-500">Student:Faculty</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costs */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-600" /> Estimated Costs (Annual)
          </h2>
          <div className="space-y-3">
            {uni.tuition_international && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tuition (International)</span>
                <span className="font-medium text-gray-900">{formatCurrency(uni.tuition_international)}</span>
              </div>
            )}
            {uni.room_and_board && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Room & Board</span>
                <span className="font-medium text-gray-900">{formatCurrency(uni.room_and_board)}</span>
              </div>
            )}
            {uni.estimated_total_cost && (
              <>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Estimated Total</span>
                  <span className="text-lg font-bold text-brand-600">{formatCurrency(uni.estimated_total_cost)}</span>
                </div>
              </>
            )}
            {uni.avg_financial_aid && (
              <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-3 -mx-1">
                <span className="text-sm text-emerald-700">Average Financial Aid</span>
                <span className="font-medium text-emerald-700">{formatCurrency(uni.avg_financial_aid)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Admissions */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> Admissions Requirements
          </h2>
          <div className="space-y-3">
            {uni.avg_sat && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average SAT</span>
                <span className="font-medium text-gray-900">{uni.avg_sat}</span>
              </div>
            )}
            {uni.avg_act && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average ACT</span>
                <span className="font-medium text-gray-900">{uni.avg_act}</span>
              </div>
            )}
            {uni.min_toefl && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Min TOEFL</span>
                <span className="font-medium text-gray-900">{uni.min_toefl}</span>
              </div>
            )}
            {uni.min_ielts && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Min IELTS</span>
                <span className="font-medium text-gray-900">{uni.min_ielts}</span>
              </div>
            )}
            <div className="pt-2 space-y-2">
              {uni.test_optional && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Test-optional available
                </div>
              )}
              {uni.international_aid_available && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> International aid available
                </div>
              )}
              {uni.merit_scholarships_available && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Merit scholarships available
                </div>
              )}
              {uni.need_blind_international && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Need-blind for international students
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Majors */}
      {uni.popular_majors && uni.popular_majors.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-3">Popular Majors</h2>
          <div className="flex flex-wrap gap-2">
            {uni.popular_majors.map(major => (
              <span key={major} className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm">
                {major}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* University-specific Scholarships */}
      {scholarships.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Scholarships at {uni.name}
          </h2>
          <div className="space-y-3">
            {scholarships.map(s => (
              <Link key={s.id} href={`/dashboard/scholarships/${s.id}`}
                className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900 text-sm">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.provider}</p>
                <div className="flex gap-2 mt-2">
                  {s.amount_max && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      Up to {formatCurrency(s.amount_max)}
                    </span>
                  )}
                  {s.renewable && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Renewable</span>
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
