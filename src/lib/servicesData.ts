export interface ServiceDetailConfig {
  title: string;
  heading: string;
  description: string;
  image: string;
  category: string;
  overview: string[];
  deliverables: string[];
}

export const staticServices: Record<string, ServiceDetailConfig> = {
  'house-construction': {
    title: 'Turnkey Home Interiors Bangalore | One Studio',
    heading: 'Turnkey Luxury Home Interiors',
    description: 'A-Grade residential interior design in Bangalore. 100% transparent pricing, 150+ quality checks, and 10-year warranty.',
    image: '/images/bangalore_modern_interior.png',
    category: 'Residential Interiors',
    overview: [
      'One Studio provides complete turnkey home interior solutions in Bangalore. We handle everything from 3D VR space planning, material selection, and lighting design to factory modular woodwork, false ceiling, and luxury finishing.',
      'Our dedicated interior designers ensure 100% finish specification compliance with daily progress tracking via our client app.',
    ],
    deliverables: [
      'Custom 3D VR & 2D Space Plans',
      'Modular Kitchens & Floor-to-Ceiling Wardrobes',
      'Marine-Grade BWP Century/Greenply Woodwork',
      '10-Year Comprehensive Woodwork & Hardware Warranty',
    ],
  },
  'interior-design': {
    title: 'Custom Home & Commercial Interior Design Bangalore | One Studio',
    heading: 'Luxury Home & Commercial Interior Design',
    description: 'Modular kitchens, wardrobes, living room interior design, and turnkey office fitouts delivered in 45 days.',
    image: '/images/bangalore_modern_interior.png',
    category: 'Interior Design',
    overview: [
      'Transform your residential or commercial space with bespoke interior design solutions from One Studio.',
      'Using BWP-grade marine plywood, premium Hettich/Blum hardware, and custom 3D visualization, we turn your floor plan into a luxurious living space within a guaranteed 45-day timeline.',
    ],
    deliverables: [
      'Custom Factory-Finished Modular Kitchens',
      'Floor-to-Ceiling Wardrobes & Storage',
      'False Ceiling & Architectural Lighting Layouts',
      '45-Day Guaranteed Delivery with 10-Year Warranty',
    ],
  },
  'commercial-construction': {
    title: 'Commercial & Office Interior Fitouts Bangalore | One Studio',
    heading: 'Commercial & Corporate Office Interior Fitouts',
    description: 'Turnkey corporate office interiors, retail store design, and commercial space fitouts in Bangalore.',
    image: '/images/bangalore_commercial_complex.png',
    category: 'Commercial Interiors',
    overview: [
      'We deliver fast-track commercial interior fitouts and corporate office spaces designed for maximum space efficiency and aesthetic elegance.',
      'From ergonomic workstations to acoustic partitions and designer lighting layouts, One Studio ensures commercial interior projects are delivered on schedule.',
    ],
    deliverables: [
      'Ergonomic Workstations & Executive Cabins',
      'Acoustic Glass Partitions & Wall Paneling',
      'Custom Reception Lobbies & Conference Rooms',
      '45-Day Delivery & Safety Compliance Documentation',
    ],
  },
};
