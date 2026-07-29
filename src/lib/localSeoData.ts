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
  'interior-designers-hyderabad': {
    title: 'Top Interior Design Company in Hyderabad | Turnkey Home Services',
    heading: 'Leading Luxury Interior Design Services in Hyderabad',
    description: 'Turnkey residential home interiors, commercial space fitouts, and luxury interior design firm in Hyderabad.',
    location: 'Hyderabad HQ',
    image: '/images/bangalore_hero_building.png',
    content: [
      'One Studio (onestudio.co.in) is Hyderabad’s premier luxury interior design studio, offering end-to-end residential home interior solutions. Located at Road No. 36, Jubilee Hills, our experienced team of interior designers, space planners, and project managers deliver bespoke quality interiors within strict 45-day timelines.',
      'From 3D space planning to factory modular woodwork and premium interior execution, we ensure 100% transparent pricing with zero cost overruns.',
    ],
    features: [
      '100% Transparent Itemized Pricing',
      'Factory Modular Woodwork',
      '10-Year Craftsmanship Guarantee',
      'Daily Site Updates via Mobile',
    ],
  },
  'interior-designers-jubilee-hills': {
    title: 'Luxury Interior Designers in Jubilee Hills Hyderabad',
    heading: 'Custom Modular Interiors & Woodwork in Jubilee Hills',
    description: 'Premium modular kitchens, wardrobes, ceiling lighting, and full house interiors in Jubilee Hills, Hyderabad.',
    location: 'Jubilee Hills',
    image: '/images/bangalore_modern_interior.png',
    content: [
      'Transform your luxury villa or apartment with custom interior design solutions from One Studio. Visit our Jubilee Hills Experience Center to explore material samples, marine-ply finishes, and hardware collections.',
      'We deliver factory-finished modular kitchens, luxury wardrobes, acoustic ceiling designs, and customized lighting layouts within 45 days.',
    ],
    features: [
      '45-Day Guaranteed Delivery',
      'BWP Grade Marine Plywood',
      'Hettich / Blum Soft-Close Fittings',
      'Free 3D Design Consultation',
    ],
  },
  'interior-designers-gachibowli': {
    title: 'Luxury Interior Designers & Contractors in Gachibowli',
    heading: 'Bespoke Home & Commercial Interiors in Gachibowli & Hitec City',
    description: 'Expert residential interior design contractors and space planners serving Gachibowli, Hitec City & Financial District.',
    location: 'Gachibowli',
    image: '/images/bangalore_commercial_complex.png',
    content: [
      'Gachibowli and Hitec City homeowners trust One Studio for luxury apartment interiors, bespoke wardrobes, and modern living room redesigns.',
      'Our design team executes contemporary architectural space plans featuring smart lighting, glass partitions, and luxury finishes.',
    ],
    features: [
      'Bespoke Villa Interiors',
      'Custom Modular Woodwork',
      'Smart Lighting & Automation',
      'Premium BWP Marine Ply',
    ],
  },
  'turnkey-interiors-banjara-hills': {
    title: 'Turnkey Interior Contractors in Banjara Hills Hyderabad',
    heading: 'Turnkey Residential & Commercial Interiors in Banjara Hills',
    description: 'Full service residential and corporate office interior contractors in Banjara Hills & Jubilee Hills.',
    location: 'Banjara Hills',
    image: '/images/bangalore_hero_building.png',
    content: [
      'Serving homeowners, IT executives, and commercial clients across Banjara Hills, Kondapur, and Madhapur with high-speed turnkey interior fitouts.',
      'We combine 3D space modeling with 150+ quality checks to ensure premium interior execution.',
    ],
    features: [
      'Rapid Execution Timelines',
      'Commercial & Office Fitouts',
      'Quality Material Certifications',
      'Turnkey Project Ownership',
    ],
  },
};
