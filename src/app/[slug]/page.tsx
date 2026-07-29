import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import Contact from '@/components/Contact';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { staticLocalSeoPages } from '@/lib/localSeoData';
import { resolveSeo } from '@/lib/seo/resolve';
import { VERIFIED_NAP } from '@/lib/seo/nap-check';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(staticLocalSeoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return resolveSeo(`/${slug}`);
}

export default async function LocalSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = staticLocalSeoPages[slug];
  if (!page) notFound();

  // LocalBusiness Schema with matching NAP and Geo Coordinates
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesign',
    name: VERIFIED_NAP.name,
    url: `https://www.onestudio.in/${slug}`,
    telephone: VERIFIED_NAP.phone,
    email: VERIFIED_NAP.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
      addressLocality: page.location || 'HBR Layout',
      addressRegion: 'Bengaluru, Karnataka',
      postalCode: '560043',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.0247,
      longitude: 77.6288,
    },
    areaServed: {
      '@type': 'City',
      name: page.location,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.onestudio.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.heading,
        item: `https://www.onestudio.in/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[localBusinessSchema, breadcrumbSchema]} />
      <Header />
      <main className="font-sans bg-slate-50">
        <PageHero title={page.heading} image={page.image || '/images/bangalore_hero_building.png'} />

        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2bd19]/20 border border-[#f2bd19]/40 text-[#f2bd19] text-xs font-black uppercase tracking-widest">
                📍 Served Service Area: {page.location}
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {page.title}
              </h2>

              <div className="space-y-4 text-slate-700 leading-relaxed text-base md:text-lg">
                {page.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-slate-900">Why Choose One Studio in {page.location}?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {page.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-800">
                      <span className="w-6 h-6 rounded-full bg-[#f2bd19] text-slate-900 flex items-center justify-center text-xs font-black shrink-0">
                        ✓
                      </span>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
                <h3 className="text-2xl font-black text-white">Book Free Consultation in {page.location}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Speak with our structural engineers or visit our HBR Layout Experience Center for blueprint reviews and cost estimates.
                </p>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-xs text-slate-400 font-bold">VERIFIED CONTACT HELPLINE</p>
                  <a href={`tel:${VERIFIED_NAP.phone.replace(/\s+/g, '')}`} className="text-xl font-black text-[#f2bd19] hover:underline block">
                    {VERIFIED_NAP.phone}
                  </a>
                  <p className="text-xs text-slate-400">{VERIFIED_NAP.email}</p>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-md overflow-hidden">
                <iframe
                  title={`One Studio Location Map - ${page.location}`}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.054593922378!2d77.6288!3d13.0247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae172a39bb871f%3A0x6b4f7e27cf5c3639!2sScrew%20Wood!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-56 rounded-2xl border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
