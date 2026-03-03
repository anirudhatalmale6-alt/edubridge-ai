import Link from 'next/link';
import {
  GraduationCap, Sparkles, MessageCircle, Award, Target,
  DollarSign, Globe, BookOpen, ArrowRight, CheckCircle2
} from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Smart Matching',
    desc: 'AI analyzes your profile to find universities and scholarships where you have the best chance of acceptance and funding.',
  },
  {
    icon: MessageCircle,
    title: 'AI Advisor Chat',
    desc: 'Get personalized help with essays, applications, visa questions, test prep, and financial planning — 24/7.',
  },
  {
    icon: Award,
    title: 'Scholarship Finder',
    desc: 'Browse 75+ real scholarships with eligibility matching. Find full-ride opportunities you qualify for.',
  },
  {
    icon: DollarSign,
    title: 'Cost Estimator',
    desc: 'See true net costs after aid. Compare pathways including community college transfer options.',
  },
  {
    icon: BookOpen,
    title: 'Application Support',
    desc: 'Step-by-step guidance for Common App, essay writing, recommendation letters, and document preparation.',
  },
  {
    icon: Globe,
    title: 'Life Preparation',
    desc: 'Visa guidance, cultural orientation, housing tips, travel planning, and a complete arrival survival kit.',
  },
];

const STEPS = [
  { num: '1', title: 'Create Your Profile', desc: 'Tell us about your academics, finances, and goals.' },
  { num: '2', title: 'Get AI Matches', desc: 'Our AI finds the best universities and scholarships for you.' },
  { num: '3', title: 'Chat with Your Advisor', desc: 'Get help with every step — essays, visas, finances, and more.' },
  { num: '4', title: 'Apply with Confidence', desc: 'Follow your personalized timeline and action plan.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-900">EduBridge AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 px-4 py-1.5 rounded-full text-sm text-brand-700 font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Study Abroad Advisor
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Your path to studying in
              <span className="text-brand-600"> the United States</span>
              {' '}starts here
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
              EduBridge AI helps first-generation and low-income international students
              find realistic scholarships, universities, and a step-by-step plan to make
              their dream of studying abroad come true.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/login" className="btn-secondary text-base px-8 py-3">
                I Already Have an Account
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-brand-200 text-sm mt-1">US Universities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">75+</p>
              <p className="text-brand-200 text-sm mt-1">Scholarships</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-brand-200 text-sm mt-1">AI Advisor</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$0</p>
              <p className="text-brand-200 text-sm mt-1">Platform Cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to study abroad</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From finding the right school to landing on US soil — EduBridge AI guides you through every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{f.title}</h3>
                <p className="text-gray-500 mt-2 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3">Four simple steps to your study abroad journey.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Built for students like you</h2>
            <p className="text-gray-500 mt-3">
              EduBridge AI is designed specifically for first-generation and low-income international students
              who dream of studying in the United States but don&apos;t have expensive counselors or connections.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
              {[
                'First-generation college students',
                'Students from low-income families',
                'Students needing full scholarships',
                'Non-native English speakers',
                'Students considering community college pathway',
                'Anyone navigating the US visa process',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to start your journey?</h2>
          <p className="text-brand-200 mt-3">
            Create your free profile in 5 minutes and get personalized university and scholarship recommendations.
          </p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-lg mt-8 hover:bg-brand-50 transition-colors text-lg">
            Get Started — It&apos;s Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-brand-900">EduBridge AI</span>
          </div>
          <p className="text-sm text-gray-400">
            Helping international students access education opportunities in the US.
          </p>
        </div>
      </footer>
    </div>
  );
}
