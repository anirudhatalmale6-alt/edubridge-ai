'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, Save, Edit3 } from 'lucide-react';
import { COUNTRIES, MAJORS } from '@/lib/utils';

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setForm(data);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, email, created_at, ...updateData } = form;
    await supabase.from('profiles').update({
      ...updateData,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Update your information to get better recommendations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/onboarding')} className="btn-ghost text-sm flex items-center gap-1">
            <Edit3 className="w-4 h-4" /> Full Wizard
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              'Saved!'
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" value={(form.full_name as string) || ''} onChange={e => updateField('full_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Country</label>
              <select className="select-field" value={(form.country as string) || ''} onChange={e => updateField('country', e.target.value)}>
                <option value="">Select</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">GPA</label>
              <input type="number" step="0.01" className="input-field" value={form.gpa?.toString() || ''} onChange={e => updateField('gpa', e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div>
              <label className="label">GPA Scale</label>
              <select className="select-field" value={(form.gpa_scale as string) || '4.0'} onChange={e => updateField('gpa_scale', e.target.value)}>
                <option value="4.0">0-4.0</option><option value="5.0">0-5.0</option><option value="10.0">0-10.0</option><option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label className="label">Intended Major</label>
              <select className="select-field" value={(form.intended_major as string) || ''} onChange={e => updateField('intended_major', e.target.value)}>
                <option value="">Select</option>
                {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Education Level</label>
              <select className="select-field" value={(form.education_level as string) || ''} onChange={e => updateField('education_level', e.target.value)}>
                <option value="high_school">High School</option>
                <option value="high_school_graduate">HS Graduate</option>
                <option value="community_college">Community College</option>
                <option value="bachelors">Bachelor&apos;s</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Scores */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Test Scores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">TOEFL</label>
              <input type="number" className="input-field" value={form.toefl_score?.toString() || ''} onChange={e => updateField('toefl_score', e.target.value ? parseInt(e.target.value) : null)} placeholder="0-120" />
            </div>
            <div>
              <label className="label">IELTS</label>
              <input type="number" step="0.5" className="input-field" value={form.ielts_score?.toString() || ''} onChange={e => updateField('ielts_score', e.target.value ? parseFloat(e.target.value) : null)} placeholder="0-9" />
            </div>
            <div>
              <label className="label">SAT</label>
              <input type="number" className="input-field" value={form.sat_score?.toString() || ''} onChange={e => updateField('sat_score', e.target.value ? parseInt(e.target.value) : null)} placeholder="400-1600" />
            </div>
            <div>
              <label className="label">ACT</label>
              <input type="number" className="input-field" value={form.act_score?.toString() || ''} onChange={e => updateField('act_score', e.target.value ? parseInt(e.target.value) : null)} placeholder="1-36" />
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Annual Family Income</label>
              <select className="select-field" value={(form.annual_family_income as string) || ''} onChange={e => updateField('annual_family_income', e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="under_5k">Under $5,000</option>
                <option value="5k_10k">$5K-$10K</option>
                <option value="10k_20k">$10K-$20K</option>
                <option value="20k_40k">$20K-$40K</option>
                <option value="40k_60k">$40K-$60K</option>
                <option value="60k_plus">Over $60K</option>
              </select>
            </div>
            <div>
              <label className="label">Max Annual Budget (USD)</label>
              <input type="number" className="input-field" value={form.max_annual_budget?.toString() || ''} onChange={e => updateField('max_annual_budget', e.target.value ? parseInt(e.target.value) : null)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
