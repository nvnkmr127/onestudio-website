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
  'interior-design': {
    title: 'Custom Home & Commercial Interior Design Hyderabad | One Studio',
    heading: 'Luxury Home & Commercial Interior Design',
    description: 'Modular kitchens, wardrobes, living room interior design, and turnkey office fitouts in Hyderabad delivered in 45 days.',
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
  'commercial-interiors': {
    title: 'Commercial & Office Interior Fitouts Hyderabad | One Studio',
    heading: 'Commercial & Corporate Office Interior Fitouts',
    description: 'Turnkey corporate office interiors, retail store design, and commercial space fitouts in Hyderabad.',
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
