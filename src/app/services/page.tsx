import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import MaintenanceComparison from "@/components/MaintenanceComparison";
import Footer from "@/components/Footer";

import type { Metadata } from 'next';
import { resolveSeo } from "@/lib/seo/resolve";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo('/services');
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero title="Our Services" image="/images/bangalore_hero_building.png" />
        <Services />
        <MaintenanceComparison />
      </main>
      <Footer />
    </>
  );
}
