'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Search, Filter, MapPin, Users, DollarSign, GraduationCap, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { University } from '@/types';

export default function UniversitiesPage() {
  const supabase = createClient();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filtered, setFiltered] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [maxTuition, setMaxTuition] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('universities').select('*').order('name');
      setUniversities(data as University[] || []);
      setFiltered(data as University[] || []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  useEffect(() => {
    let result = universities;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q) ||
        u.popular_majors?.some(m => m.toLowerCase().includes(q))
      );
    }
    if (stateFilter) result = result.filter(u => u.state === stateFilter);
    if (typeFilter) result = result.filter(u => u.type === typeFilter);
    if (maxTuition) result = result.filter(u => (u.tuition_international || 0) <= parseInt(maxTuition));

    setFiltered(result);
  }, [search, stateFilter, typeFilter, maxTuition, universities]);

  const states = [...new Set(universities.map(u => u.state))].sort();

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
        <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
        <p className="text-gray-500 mt-1">Browse {universities.length} US universities and find your best fit.</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" className="input-field pl-10" placeholder="Search by name, city, state, or major..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost flex items-center gap-2 border border-gray-200">
            <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">State</label>
              <select className="select-field text-sm" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                <option value="">All states</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select className="select-field text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All types</option>
                <option value="public">Public</option>
                <option value="private_nonprofit">Private Nonprofit</option>
                <option value="community_college">Community College</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Tuition (International)</label>
              <select className="select-field text-sm" value={maxTuition} onChange={e => setMaxTuition(e.target.value)}>
                <option value="">Any</option>
                <option value="10000">Under $10,000</option>
                <option value="20000">Under $20,000</option>
                <option value="30000">Under $30,000</option>
                <option value="40000">Under $40,000</option>
                <option value="50000">Under $50,000</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} universities found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(uni => (
          <Link key={uni.id} href={`/dashboard/universities/${uni.id}`}
            className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{uni.name}</h3>
                  {uni.us_news_rank && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">#{uni.us_news_rank}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" /> {uni.city}, {uni.state}
                  <span className="mx-1">·</span>
                  <span className="capitalize">{uni.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{uni.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  {uni.acceptance_rate != null && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3 h-3" /> {uni.acceptance_rate}% accept
                    </span>
                  )}
                  {uni.tuition_international && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-3 h-3" /> {formatCurrency(uni.tuition_international)}/yr
                    </span>
                  )}
                  {uni.international_aid_available && (
                    <span className="text-emerald-600 font-medium">Aid available</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No universities match your filters.</p>
          <button onClick={() => { setSearch(''); setStateFilter(''); setTypeFilter(''); setMaxTuition(''); }}
            className="text-sm text-brand-600 mt-2 hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
