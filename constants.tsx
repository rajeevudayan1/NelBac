
import { Product, Service, BlogPost } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'nc-flagship',
    name: 'Nelbac Controller (NC)',
    tagline: 'The Flagship Automator',
    description: 'Cloud-based wireless IoT controller tailored for agriculture, landscaping, and industrial sectors.',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1000',
    video: 'https://player.vimeo.com/external/494252666.sd.mp4?s=727e335431665a3c00445d44745c928b52f6f195&profile_id=164',
    category: 'Flagship',
    features: [
      'Multi-zone irrigation control',
      'Power failure recovery auto-resume',
      'Weather-proof industrial build',
      'Real-time detailed analytics'
    ],
    specs: {
      "Compatibility": "AC/DC, 12V or 24V Valves",
      "Network": "Cloud-ready Wireless",
      "Control": "iOS, Android & Web App",
      "Zones": "Up to 32 Expandable"
    }
  },
  {
    id: 'nb-node-env',
    name: 'Precision Node S',
    tagline: 'Laboratory-Grade Sensing',
    description: 'High-fidelity multisensor capable of tracking environmental variables with laboratory precision.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    category: 'Sensor',
    features: [
      'Temp/Humidity Accuracy',
      'Soil Moisture Integration',
      'UV & Ambient Light Sensing',
      '5-Year Battery Life'
    ],
    specs: {
      "Accuracy": "±0.1°C Precision",
      "Refresh": "Customizable (1s - 1hr)",
      "Battery": "Dual CR123A",
      "Protocol": "Zigbee / Matter"
    }
  },
  {
    id: 'nc-expansion',
    name: 'Nelbac Expansion Rack',
    tagline: 'Scale Without Limits',
    description: 'Modular expansion unit for the NC flagship, allowing for massive industrial automation arrays.',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    category: 'Module',
    features: [
      'Hot-swappable relays',
      'DIN Rail Mountable',
      'Daisy-chain support',
      'Status LED diagnostics'
    ],
    specs: {
      "Ports": "16 Relay Outputs",
      "Voltage": "Max 250V AC",
      "Interface": "Proprietary Nelbac Link",
      "Safety": "Fused Protection"
    }
  }
];

export const SERVICES: Service[] = [
  {
    id: 'serv-1',
    title: 'Precision Consultation',
    description: 'Expert analysis of your land or facility to design the optimal automation layout.',
    icon: 'fa-chess-king'
  },
  {
    id: 'serv-2',
    title: 'Professional Installation',
    description: 'White-glove deployment by certified Nelbac technicians to ensure zero-downtime integration.',
    icon: 'fa-tools'
  },
  {
    id: 'serv-3',
    title: 'Custom Integration',
    description: 'Tailored software solutions to link Nelbac hardware with your existing enterprise systems.',
    icon: 'fa-code'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Future of Precision Agriculture',
    excerpt: 'How IoT is saving millions of gallons of water in the Bangalore belt.',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'blog-2',
    title: 'Industrial Power Recovery',
    excerpt: 'Why "Always Reliable" is not just a slogan for our latest controllers.',
    date: 'Nov 02, 2024',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600'
  }
];
