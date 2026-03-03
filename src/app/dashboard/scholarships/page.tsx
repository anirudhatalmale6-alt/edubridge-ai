'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Search, Filter, Award, DollarSign, Calendar, ChevronDown, Globe } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Scholarship } from '@/types';

export default function ScholarshipsPage() {
  const supabase = createClient();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filtered, setFiltered] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('scholarships').select('*, university:universities(name)').order('amount_max', { ascending: false, nullsFirst: false });
      setScholarships(data as Scholarship[] || []);
      setFiltered(data as Scholarship[] || []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  useEffect(() => {
    let result = scholarships;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    if (typeFilter) result = result.filter(s => s.type === typeFilter);
    setFiltered(result);
  }, [search, typeFilter, scholarships]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
        <p className="text-gray-500 mt-1">Browse {scholarships.length} scholarships for international students.</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" className="input-field pl-10" placeholder="Search scholarships..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost flex items-center gap-2 border border-gray-200">
            <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <label className="text-xs text-gray-500 mb-1 block">Scholarship Type</label>
            <select className="select-field text-sm max-w-xs" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              <option value="full_ride">Full Ride</option>
              <option value="merit">Merit-Based</option>
              <option value="need_based">Need-Based</option>
              <option value="country_specific">Country-Specific</option>
              <option value="field_specific">Field-Specific</option>
            </select>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} scholarships found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(s => (
          <Link key={s.id} href={`/dashboard/scholarships/${s.id}`}
            className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{s.provider}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{s.description}</p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {s.amount_max && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <DollarSign className="w-3 h-3" />
                      {s.amount_min && s.amount_min !== s.amount_max
                        ? `${formatCurrency(s.amount_min)} - ${formatCurrency(s.amount_max)}`
                        : `Up to ${formatCurrency(s.amount_max)}`}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {s.type.replace(/_/g, ' ')}
                  </span>
                  {s.renewable && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Renewable</span>
                  )}
                  {s.covers_tuition && (
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Full tuition</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {s.deadline && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.deadline}</span>
                  )}
                  {s.eligible_countries && (
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {s.eligible_countries.length} countries</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No scholarships match your filters.</p>
          <button onClick={() => { setSearch(''); setTypeFilter(''); }}
            className="text-sm text-brand-600 mt-2 hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
