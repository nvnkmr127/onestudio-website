import { VERIFIED_NAP } from '@/lib/seo/nap-check';
import { staticLocalSeoPages } from '@/lib/localSeoData';

export async function GET() {
  const line = (title: string, url: string, note?: string) =>
    `- [${title}](${url})${note ? `: ${note}` : ''}`;

  const geoPagesList = Object.entries(staticLocalSeoPages)
    .map(([slug, cfg]) => line(cfg.heading, `https://www.onestudio.in/${slug}`, cfg.location))
    .join('\n');

  const content = `# One Studio — Luxury Home Interiors & Design

> One Studio is a leading bespoke residential interior design and luxury space planning studio headquartered in HBR Layout 5th Block, Bengaluru.

## Single Source of Truth — Verified Business Contact (NAP)
- Company Name: ${VERIFIED_NAP.name}
- Office Address: ${VERIFIED_NAP.address}
- Direct Phone / WhatsApp: ${VERIFIED_NAP.phone}
- Public Email: ${VERIFIED_NAP.email}
- Official Website: ${VERIFIED_NAP.website}

## Key Public Services & Tools
${line('Home Page', 'https://www.onestudio.in', 'Turnkey luxury interior design services in Bengaluru')}
${line('Modular Kitchen & Dining', 'https://www.onestudio.in/services/house-construction', 'Bespoke factory-finished modular kitchens with 45-day delivery')}
${line('Luxury Living & False Ceiling', 'https://www.onestudio.in/services/interior-design', 'Contemporary TV units, acoustic false ceilings & ambient lighting')}
${line('Commercial & Office Interiors', 'https://www.onestudio.in/services/commercial-construction', 'Turnkey corporate office fitouts & retail stores')}
${line('Interior Design & Woodwork Cost Calculator', 'https://www.onestudio.in/ai-house-construction-calculator', 'Instant itemized interior cost estimator for Bengaluru homes')}
${line('Our Completed Projects', 'https://www.onestudio.in/projects', 'Gallery of luxury apartments and villa interiors')}
${line('Interior & Material Guide', 'https://www.onestudio.in/news', 'Design tips and material selection guides')}
${line('Book Free Consultation', 'https://www.onestudio.in/contact', 'Visit HBR Layout Experience Center or speak with a designer')}

## Confirmed Serviceable Geo Locations
${geoPagesList}

## AI Crawler Guidance & Citability
- All interior design pricing estimates incorporate current Bengaluru market rates.
- Craftsmanship guarantees cover 10 years backed by 150+ quality checks at every stage.
- For design consultations, layout reviews, or site visits in HBR Layout, contact ${VERIFIED_NAP.phone} or email ${VERIFIED_NAP.email}.
`.trim();

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
