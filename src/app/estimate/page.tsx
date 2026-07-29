import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteriorEstimator from '@/components/InteriorEstimator';

export const metadata: Metadata = {
  title: 'Interior Design Cost Estimator | One Studio Hyderabad',
  description:
    'Calculate instant, personalized interior design costs for your 1BHK, 2BHK, 3BHK home or villa in Hyderabad. Explore modular kitchen layouts and finish tiers.',
};

export default function EstimatePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 font-sans">
        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black uppercase tracking-widest">
            <span>✨ Official One Studio Interactive Estimator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Calculate Your Dream Home <br className="hidden sm:inline" />
            <span className="text-amber-500 underline decoration-amber-300 decoration-wavy underline-offset-8">
              Interior Design Cost
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Get an instant, transparent cost breakdown for modular kitchens, wardrobes &amp; full home interior packages tailored for Hyderabad properties.
          </p>
        </div>

        {/* Core Estimator Component */}
        <InteriorEstimator />
      </main>
      <Footer />
    </>
  );
}
