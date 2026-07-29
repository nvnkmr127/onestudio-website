export interface LocalSeoPageConfig {
  title: string;
  heading: string;
  description: string;
  location: string;
  image?: string;
  content: string[];
  features: string[];
}

export const staticLocalSeoPages: Record<string, LocalSeoPageConfig> = {
  'construction-company-bangalore': {
    title: 'Top Construction Company in Bangalore | Turnkey Building Services',
    heading: 'Leading Construction Services in Bangalore',
    description: 'Turnkey residential house construction, commercial building contractor, and luxury interior design firm in Bangalore.',
    location: 'Bangalore HQ',
    image: '/images/bangalore_hero_building.png',
    content: [
      'One Studio is Bangalore’s premier luxury interior design firm, offering end-to-end residential home interior solutions. Located at HBR Layout 5th Block, our experienced team of interior designers, space planners, and project managers deliver bespoke quality interiors within strict 45-day timelines.',
      'From BBMP plan approval assistance to 3D architectural blueprinting, excavation, RCC framing, and premium interior execution, we ensure 100% transparent pricing with zero cost overruns.',
    ],
    features: [
      '100% Transparent Itemized Pricing',
      'BBMP Plan Approval Assistance',
      '10-Year Structural Guarantee',
      'Daily Site Updates via Mobile',
    ],
  },
  'construction-company-hbr-layout': {
    title: 'Best Construction Company in HBR Layout Bangalore',
    heading: 'Turnkey House Construction in HBR Layout',
    description: 'Top rated building contractors in HBR Layout 5th Block, Bangalore. Custom luxury home construction and interior solutions.',
    location: 'HBR Layout 5th Block',
    image: '/images/bangalore_architect_planning.png',
    content: [
      'Operating directly from our Experience Center on 38th Cross Rd, HBR Layout 5th Block, One Studio specializes in luxury residential interiors and turnkey modular kitchens tailored for HBR Layout homes.',
      'Our local expertise ensures full compliance with BBMP setback norms, soil testing requirements, and utility connections in North Bangalore.',
    ],
    features: [
      'Headquartered in HBR Layout 5th Block',
      'Local BBMP Sanction Expertise',
      'Dedicated Site Supervisor',
      'Eco-Friendly AAC & Clay Brick Options',
    ],
  },
  'interior-designers-hbr-layout': {
    title: 'Luxury Interior Designers in HBR Layout Bangalore',
    heading: 'Custom Modular Interiors & Woodwork in HBR Layout',
    description: 'Premium modular kitchens, wardrobes, ceiling lighting, and full house interiors in HBR Layout, Bangalore.',
    location: 'HBR Layout',
    image: '/images/bangalore_modern_interior.png',
    content: [
      'Transform your apartment or villa with custom interior design solutions from One Studio. Visit our HBR Layout Experience Center to explore material samples, marine-ply finishes, and hardware collections.',
      'We deliver factory-finished modular kitchens, luxury wardrobes, acoustic ceiling designs, and customized lighting layouts within 45 days.',
    ],
    features: [
      '45-Day Guaranteed Delivery',
      'BWP Grade Marine Plywood',
      'Hettich / Blum Soft-Close Fittings',
      'Free 3D Design Consultation',
    ],
  },
  'house-construction-indiranagar': {
    title: 'House Construction & Interior Contractors in Indiranagar',
    heading: 'Luxury Home Builders in Indiranagar, Bangalore',
    description: 'Expert residential construction contractors and interior space planners serving Indiranagar.',
    location: 'Indiranagar',
    image: '/images/bangalore_commercial_complex.png',
    content: [
      'Indiranagar homeowners trust One Studio for luxury apartment interiors, bespoke wardrobes, and modern living room redesigns.',
      'Our engineering team executes contemporary architectural designs featuring smart lighting, glass facades, and energy-efficient building envelopes.',
    ],
    features: [
      'Architectural Villa Designs',
      'Vertical Floor Additions',
      'Smart Automation Ready',
      'High Structural Durability',
    ],
  },
  'turnkey-contractors-whitefield': {
    title: 'Turnkey Construction Contractors in Whitefield Bangalore',
    heading: 'Turnkey Residential & Commercial Construction in Whitefield',
    description: 'Full service building construction and office interior contractors in Whitefield & ITPB region.',
    location: 'Whitefield',
    image: '/images/bangalore_hero_building.png',
    content: [
      'Serving IT professionals and commercial clients across Whitefield, Sarjapur, and Marathahalli with high-speed turnkey construction.',
      'We combine 3D BIM modeling with strict quality checks at every concrete pour to ensure premium structural integrity.',
    ],
    features: [
      'Rapid Execution Timelines',
      'Commercial & Office Fitouts',
      'Quality Material Certifications',
      'Turnkey Project Ownership',
    ],
  },
};
