import type { Metadata } from 'next';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProcessSteps from "@/components/ProcessSteps";
import Brands from "@/components/Brands";
import Services from "@/components/Services";
import CostCalculatorTeaser from "@/components/CostCalculatorTeaser";
import EmiBanner from "@/components/EmiBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import MaintenanceComparison from "@/components/MaintenanceComparison";
import Testimonials from "@/components/Testimonials";
import Projects from "@/components/Projects";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import StickyQuoteCta from "@/components/StickyQuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

import { resolveSeo } from "@/lib/seo/resolve";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo('/');
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <ProcessSteps />
        <Brands />
        <Services />
        <CostCalculatorTeaser />
        <EmiBanner />
        <WhyChooseUs />
        <MaintenanceComparison />
        <Testimonials />
        <Projects />
        <FAQ />
        <Blog />
      </main>
      <Footer />
      <StickyQuoteCta />
    </>
  );
}
