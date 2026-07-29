import type { Metadata } from "next";
import "./globals.css";
import { resolveSeo } from "@/lib/seo/resolve";
import CallModal from "@/components/CallModal";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import WebVitals from "@/components/WebVitals";
import { getSchemasForPath } from "@/lib/seo/schema-resolution";
import { getPublicTrackingConfig } from "@/app/actions/tracking";

export async function generateMetadata(): Promise<Metadata> {
  const baseSeo = await resolveSeo('/');
  return {
    ...baseSeo,
    metadataBase: new URL('https://www.onestudio.co'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [globalSchemas, trackingRes] = await Promise.all([
    getSchemasForPath('/'),
    getPublicTrackingConfig(),
  ]);

  const publicTrackingConfig = trackingRes.ok ? trackingRes.data || null : null;

  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={globalSchemas} />
        <Analytics config={publicTrackingConfig} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-slate-800 font-sans">
        {children}
        <CallModal />
        <ConsentBanner />
        <WebVitals />
      </body>
    </html>
  );
}
