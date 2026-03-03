'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Award, DollarSign, Calendar, Globe, GraduationCap,
  CheckCircle2, ExternalLink, BookOpen, Users
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Scholarship, University } from '@/types';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const supabase = createClient();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('scholarships').select('*').eq('id', id).single();
      setScholarship(data as Scholarship);
      if (data?.university_id) {
        const { data: uni } = await supabase.from('universities').select('*').eq('id', data.university_id).single();
        setUniversity(uni as University);
      }
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

  if (!scholarship) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Scholarship not found.</p>
        <Link href="/dashboard/scholarships" className="text-brand-600 text-sm mt-2 inline-block">Back to scholarships</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/scholarships" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to scholarships
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{scholarship.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Provided by {scholarship.provider}</p>
            <p className="text-sm text-gray-600 mt-3">{scholarship.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
                {scholarship.type.replace(/_/g, ' ')}
              </span>
              {scholarship.renewable && (
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Renewable ({scholarship.duration_years} years)
                </span>
              )}
              {scholarship.covers_tuition && (
                <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">Covers tuition</span>
              )}
              {scholarship.covers_living && (
                <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Covers living</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Award Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Award Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">
                {scholarship.amount_min && scholarship.amount_min !== scholarship.amount_max
                  ? `${formatCurrency(scholarship.amount_min)} - ${formatCurrency(scholarship.amount_max || 0)}`
                  : scholarship.amount_max ? formatCurrency(scholarship.amount_max) : 'Varies'}
              </span>
            </div>
            {scholarship.deadline && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deadline</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" /> {scholarship.deadline}
                </span>
              </div>
            )}
            {scholarship.application_url && (
              <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Eligibility */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-600" /> Eligibility Requirements
          </h2>
          <div className="space-y-3">
            {scholarship.min_gpa && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum GPA</span>
                <span className="font-medium text-gray-900">{scholarship.min_gpa}</span>
              </div>
            )}
            {scholarship.min_toefl && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum TOEFL</span>
                <span className="font-medium text-gray-900">{scholarship.min_toefl}</span>
              </div>
            )}
            {scholarship.min_ielts && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum IELTS</span>
                <span className="font-medium text-gray-900">{scholarship.min_ielts}</span>
              </div>
            )}
            {scholarship.education_level && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Education Level</span>
                <span className="font-medium text-gray-900 capitalize">{scholarship.education_level.join(', ')}</span>
              </div>
            )}
            {scholarship.income_requirement && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Income Requirement</span>
                <span className="font-medium text-gray-900 capitalize">{scholarship.income_requirement.replace(/_/g, ' ')}</span>
              </div>
            )}
            {scholarship.first_gen_only && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Users className="w-4 h-4" /> First-generation students only
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Eligible Countries */}
      {scholarship.eligible_countries && scholarship.eligible_countries.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-600" /> Eligible Countries
          </h2>
          <div className="flex flex-wrap gap-2">
            {scholarship.eligible_countries.map(c => (
              <span key={c} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Eligible Majors */}
      {scholarship.eligible_majors && scholarship.eligible_majors.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" /> Eligible Majors
          </h2>
          <div className="flex flex-wrap gap-2">
            {scholarship.eligible_majors.map(m => (
              <span key={m} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm">{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {scholarship.requirements && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-3">Application Requirements</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{scholarship.requirements}</p>
        </div>
      )}

      {/* University Link */}
      {university && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" /> Associated University
          </h2>
          <Link href={`/dashboard/universities/${university.id}`} className="text-brand-600 hover:underline text-sm">
            {university.name}
          </Link>
        </div>
      )}
    </div>
  );
}
