import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

import type { Metadata } from 'next';
import { resolveSeo } from "@/lib/seo/resolve";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo('/contact');
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero title="Contact Us" image="/images/bangalore_modern_interior.png" />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
