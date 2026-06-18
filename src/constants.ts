import { Product, Service, BlogPost, VisionSection, SearchableItem, Page, Milestone, Partner, Testimonial, FaqCategory } from '@/types';
import product2Zone from '@/assets/images/products/2ZONE-COVER-IMAGE-600x600.jpg';
import product4Zone from '@/assets/images/products/4ZONE-COVER-IMAGE-600x600.jpg';
import product6Zone from '@/assets/images/products/6ZONE-COVER-IMAGE-600x600.jpg';

// App configuration
export const AUTO_PLAY_DURATION = 5000;

// Navigation items
export const NAV_ITEMS = ['Home', 'Products', 'About Us', 'FAQ', 'Blog'];

// Company Information
export const COMPANY_INFO = {
  name: 'Nelbac',
  tagline: 'Automate Anything.',
  founded: '2020',
  location: 'Bangalore, India',
  description: 'Nelbac is a Bangalore-based emerging technology startup focused on developing next-generation automation controllers for landscape designers, homeowners, property owners, and agricultural customers.',
  fullDescription: 'Founded in 2020, Nelbac has been recognized by leading institutions including Pitch Perfect (IIT Bombay), IITB Eureka Finalist 2021, and awarded the RKVY RAFTAR Grant from the Government of India. During the Covid slowdown, we strategically prioritized product development and compliance — resulting in one published patent (under examination), one provisional patent filed, and a granted design patent and trademark. Today, Nelbac is re-entering the market with an advanced version of our automation controller, with strong early traction and pre-bookings validating both product-market fit and customer demand.',
  mission: 'Make the farm automation technologies aspirational for small holders to take up agriculture as a business.',
  whoWeAre: 'A team of engineers aiming to find solutions for small/marginal farm, landscaping and home garden automation.',
  whatWeDo: 'Our focus is on developing automation devices for small/marginal farms, urban home gardens, vertical gardens, hydroponics and aquaponics.',
};

export const COMPANY_STATS = [
  { value: '2020', label: 'Founded', suffix: '' },
  { value: '5+', label: 'Years Experience', suffix: '' },
  { value: '1000+', label: 'Devices Deployed', suffix: '' },
  { value: '99.9', label: 'Uptime', suffix: '%' },
];

export const COMPANY_VALUES = [
  {
    title: 'Innovation',
    description: 'Pioneering smart irrigation solutions that transform how India farms and gardens.',
    icon: 'lightbulb'
  },
  {
    title: 'Sustainability',
    description: 'Every drop counts. Our technology ensures optimal water usage for a greener tomorrow.',
    icon: 'leaf'
  },
  {
    title: 'Accessibility',
    description: 'Making advanced automation technology affordable for small and marginal farmers.',
    icon: 'users'
  },
  {
    title: 'Reliability',
    description: 'Built for Indian conditions - rugged, dependable, and always operational.',
    icon: 'shield'
  }
];

export const MILESTONES: Milestone[] = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'Nelbac incorporated in Bangalore as an emerging technology startup focused on next-generation automation controllers.'
  },
  {
    year: '2021',
    title: 'Industry Recognition',
    description: 'Recognized at Pitch Perfect (IIT Bombay) and selected as IITB Eureka Finalist 2021.'
  },
  {
    year: '2022',
    title: 'RKVY RAFTAR Grant',
    description: 'Awarded the RKVY RAFTAR Grant from the Government of India for agricultural innovation.'
  },
  {
    year: '2023',
    title: 'IP & Compliance Milestones',
    description: 'Published patent (under examination), filed provisional patent, and secured a granted design patent and trademark.'
  },
  {
    year: '2025',
    title: 'Market Re-entry',
    description: 'Re-entering the market with an advanced automation controller. Strong early traction with pre-bookings validating product-market fit.'
  }
];

export const PARTNERS: Partner[] = [
  {
    name: 'Pitch Perfect (IIT Bombay)',
    description: 'Recognized at IIT Bombay\'s startup pitch competition'
  },
  {
    name: 'IITB Eureka',
    description: 'Finalist at IITB Eureka 2021 — one of India\'s premier startup competitions'
  },
  {
    name: 'RKVY RAFTAR Grant',
    description: 'Awarded by the Government of India for agri-tech innovation'
  },
  {
    name: 'Start-up India (DPIIT)',
    description: 'Department for Promotion of Industry and Internal Trade, Government of India'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rajesh Kumar',
    role: 'Farm Owner',
    company: 'Kumar Organic Farms',
    location: 'Karnataka, India',
    content: 'The NBGATV3.4 transformed our irrigation system completely. We\'ve reduced water consumption by 40% while our crop yield increased significantly. The automated scheduling is a game-changer for our farm.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Priya Sharma',
    role: 'Landscape Designer',
    company: 'GreenScape Studios',
    location: 'Mumbai, India',
    content: 'As a landscape designer, I recommend Nelbac controllers to all my clients. The reliability and ease of use make it perfect for residential projects. The support team is exceptional!',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Mohammed Ali',
    role: 'Operations Manager',
    company: 'Desert Bloom Nursery',
    location: 'Dubai, UAE',
    content: 'We operate in extreme conditions, and the Nelbac controller handles it flawlessly. The memory backup during power outages has saved us multiple times. Highly recommended!',
    rating: 5
  },
  {
    id: 'test-4',
    name: 'Sarah Chen',
    role: 'Hydroponics Specialist',
    company: 'Urban Harvest Co.',
    location: 'Singapore',
    content: 'The precision control offered by NBGATV3.6 is exactly what our hydroponic setup needed. Different durations for each zone based on plant requirements - brilliant engineering!',
    rating: 5
  },
  {
    id: 'test-5',
    name: 'Anand Patel',
    role: 'Property Developer',
    company: 'Patel Constructions',
    location: 'Gujarat, India',
    content: 'We\'ve installed Nelbac systems in over 50 residential properties. The build quality and customer satisfaction rate is unmatched. It\'s now our standard specification for all projects.',
    rating: 5
  },
  {
    id: 'test-6',
    name: 'Lisa Thompson',
    role: 'Homeowner',
    company: 'Residential User',
    location: 'Bangalore, India',
    content: 'Finally, an irrigation controller that just works! Setup was straightforward, and my rooftop garden has never looked better. The water savings paid for the unit in months.',
    rating: 5
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'nbgatv3-2',
    name: 'NBGATV3.2',
    tagline: 'Two Zone Irrigation Controller',
    description: 'Two Zone irrigation controller with one solenoid valve. Perfect for residential gardens, lawns, rooftop gardens, and light commercial applications.',
    price: 149.00,
    image: product2Zone,
    video: 'https://player.vimeo.com/external/494252666.sd.mp4?s=727e335431665a3c00445d44745c928b52f6f195&profile_id=164',
    category: 'Controller',
    features: [
      '2 Station Models – Perfect for residential',
      'Supports 2 valves and/or water pump',
      'Memory saves program during power outages',
      'Flexible Manual Operation'
    ],
    specs: {
      "Zones": "2 Stations",
      "Applications": "Residential & Light Commercial",
      "Environment": "Indoor/Outdoor",
      "Water Source": "Pump & Tank Support"
    }
  },
  {
    id: 'nbgatv3-4',
    name: 'NBGATV3.4',
    tagline: 'Four Zone Irrigation Controller',
    description: 'Four Zone irrigation controller with one solenoid valve. Different duration can be set for each zone based on plant type, emitters, water pressure, and flow rate.',
    price: 199.00,
    image: product4Zone,
    category: 'Controller',
    features: [
      '4 Station Models – Perfect for residential',
      'Supports 4 valves and/or water pump',
      'Individual zone duration settings',
      'Memory saves program during power outages'
    ],
    specs: {
      "Zones": "4 Stations",
      "Applications": "Residential, Hydroponics, Aquaponics",
      "Environment": "Indoor/Outdoor",
      "Water Source": "Pump & Tank Support"
    }
  },
  {
    id: 'nbgatv3-6',
    name: 'NBGATV3.6',
    tagline: 'Six Zone Irrigation Controller',
    description: 'Six Zone irrigation controller with one solenoid valve. Different duration can be set for each zone based on plant type, emitters, water pressure, and flow rate. Ideal for small/marginal farms.',
    price: 249.00,
    image: product6Zone,
    category: 'Controller',
    features: [
      '6 Station Models – Perfect for farms',
      'Supports 6 valves and/or water pump',
      'Individual zone duration settings',
      'Memory saves program during power outages'
    ],
    specs: {
      "Zones": "6 Stations",
      "Applications": "Farms, Hydroponics, Aquaponics",
      "Environment": "Indoor/Outdoor",
      "Water Source": "Pump & Tank Support"
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

export const VISION_SECTIONS: VisionSection[] = [
  {
    title: "Get productive.",
    subtitle: "Simplify labour.",
    content: "Experience the power of automation in your daily life. Reduce the need for manual intervention and repetitive tasks. Reallocate labour to more strategic or specialized tasks, maximizing productivity and output.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1920",
    accent: "Productive"
  },
  {
    title: "Always reliable.",
    subtitle: "Consistent performance.",
    content: "Once set. All set. Our power failure recovery feature automatically resumes operation after a power outage, ensuring uninterrupted watering schedules and industrial precision.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920",
    accent: "Reliable"
  },
  {
    title: "Stay efficient.",
    subtitle: "Control your yield.",
    content: "Our configurable controller streamlines processes with multi-zone control, programmable schedules, and condition-based adjustments to regulate pressure and flow precisely.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1920",
    accent: "Efficient"
  },
  {
    title: "Be on the go.",
    subtitle: "Stay connected.",
    content: "Remote monitoring and control empowers proactive decision-making. Receive instant updates and insights into device status and performance from anywhere in the world.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920",
    accent: "Connected"
  },
  {
    title: "Resource Efficient.",
    subtitle: "Conserve life.",
    content: "Prevent over or under watering with precise scheduling and zone-based optimal distribution. Protect resources while maintaining lush environments through intelligent systems.",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80&w=1920",
    accent: "Conserve"
  },
  {
    title: "Analyse data.",
    subtitle: "Unlock precision.",
    content: "Harness data analytics for smarter irrigation. Make data-driven decisions regarding irrigation, leading to better crop health, increased yields, and improved quality of produce.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1920",
    accent: "Precision"
  },
  {
    title: "Be flexible.",
    subtitle: "Automate anywhere.",
    content: "Integrate any IoT device into your workflow. Our device is compatible with all standard valves be it AC or DC, 12V or 24V. Scale without technical debt.",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1000",
    accent: "Flexible"
  }
];

export const SEARCHABLE_CONTENT: SearchableItem[] = [
  // Pages
  { title: 'Home', description: 'Return to the main landing page', category: 'page', targetPage: Page.Home },
  { title: 'Products', description: 'Browse our hardware catalog', category: 'page', targetPage: Page.Products },
  { title: 'About Us', description: 'Learn about Nelbac and our mission', category: 'page', targetPage: Page.AboutUs },
  { title: 'Cart', description: 'View your shopping cart', category: 'page', targetPage: Page.Cart },
  // Products
  { title: 'NBGATV3.2', description: 'Two Zone irrigation controller for residential & light commercial - ₹149', category: 'product', targetPage: Page.Products },
  { title: 'NBGATV3.4', description: 'Four Zone irrigation controller for hydroponics & aquaponics - ₹199', category: 'product', targetPage: Page.Products },
  { title: 'NBGATV3.6', description: 'Six Zone irrigation controller for small/marginal farms - ₹249', category: 'product', targetPage: Page.Products },
  // Features
  { title: 'Two Zone Control', description: 'Perfect for residential gardens and lawns', category: 'feature', targetPage: Page.Products },
  { title: 'Four Zone Control', description: 'Individual duration settings per zone', category: 'feature', targetPage: Page.Products },
  { title: 'Six Zone Control', description: 'Ideal for small farms and commercial use', category: 'feature', targetPage: Page.Products },
  { title: 'Power Failure Recovery', description: 'Memory saves program during power outages', category: 'feature', targetPage: Page.Home },
  { title: 'Remote Monitoring', description: 'Monitor and control from anywhere in the world', category: 'feature', targetPage: Page.Home },
  { title: 'Data Analytics', description: 'Harness data for smarter irrigation decisions', category: 'feature', targetPage: Page.Home },
  { title: 'Automation', description: 'Simplify labour with intelligent automation', category: 'feature', targetPage: Page.Home },
  { title: 'Resource Efficiency', description: 'Conserve water with precise scheduling', category: 'feature', targetPage: Page.Home },
  // About Us related
  { title: 'Our Mission', description: 'Make farm automation aspirational for small holders', category: 'feature', targetPage: Page.AboutUs },
  { title: 'Award Winning', description: 'Recognized at Pitch Perfect (IIT Bombay), IITB Eureka 2021, and RKVY RAFTAR Grant recipient', category: 'feature', targetPage: Page.AboutUs },
  { title: 'Bangalore', description: 'Nelbac headquarters location', category: 'feature', targetPage: Page.AboutUs },
  { title: 'FAQ', description: 'Answers about products, orders, delivery and accounts', category: 'page', targetPage: Page.FAQ },
];

// Frequently asked questions — sourced from product specs, delivery/payment
// flows, account features and company info.
export const FAQS: FaqCategory[] = [
  {
    category: 'Products & Hardware',
    icon: 'fa-microchip',
    items: [
      {
        q: 'Which controllers does Nelbac offer?',
        a: 'Three automation controllers: the NBGATV3.2 (2 zones, ₹149) for residential gardens and light commercial use, the NBGATV3.4 (4 zones, ₹199) ideal for residential, hydroponics and aquaponics, and the NBGATV3.6 (6 zones, ₹249) built for small and marginal farms.',
      },
      {
        q: 'How do I choose the right number of zones?',
        a: 'Each zone controls an independent valve/area with its own watering duration. Pick 2 zones for a home garden or lawn, 4 zones for larger residential or hydroponic/aquaponic setups, and 6 zones for farms and bigger installations.',
      },
      {
        q: 'Are the controllers weatherproof?',
        a: 'Yes. Every controller ships in an IP65-rated enclosure rated for both indoor and outdoor mounting, and installs in under 30 minutes with the quick-connect terminal system.',
      },
      {
        q: 'What happens during a power outage?',
        a: 'Our proprietary EEPROM-based memory keeps your irrigation schedules intact through outages. When power returns, the controller automatically resumes exactly where it left off — no reprogramming and no missed cycles.',
      },
      {
        q: 'Which valves and pumps are supported?',
        a: 'The controllers work with standard AC solenoid valves and DC latch valves, and support direct water-pump control through a built-in relay with protection.',
      },
      {
        q: 'Is there a warranty?',
        a: 'Yes — all controllers come with a 2-year warranty.',
      },
    ],
  },
  {
    category: 'Orders & Payment',
    icon: 'fa-credit-card',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Add a controller to your cart, open the cart and select Checkout. After signing in, choose a shipping address and payment method, then place the order. You can review it anytime under My Account → My Orders.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'Cash on Delivery (where serviceable) and Online / Bank Transfer. For online payments our team shares a secure payment link after the order is placed.',
      },
      {
        q: 'Can I use a coupon code?',
        a: 'Yes. Enter your coupon at checkout and the discount is validated and applied to your order total before you confirm.',
      },
      {
        q: 'Can I cancel an order?',
        a: 'Orders can be cancelled while they are still Pending or Confirmed. Open My Account → My Orders, expand the order and choose Cancel Order. Stock is automatically restored.',
      },
    ],
  },
  {
    category: 'Delivery',
    icon: 'fa-truck-fast',
    items: [
      {
        q: 'Do you deliver to my area?',
        a: 'Enter your pincode in the “Check Delivery” box on any product page, or at checkout, to instantly see availability, estimated delivery time and any delivery charge for your location.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Estimated delivery is typically 5–7 business days, though the exact timeframe depends on your pincode and is shown when you run the delivery check.',
      },
      {
        q: 'Are there delivery charges?',
        a: 'Delivery charges vary by location and are shown during the pincode check. Many areas qualify for free delivery above a minimum order value.',
      },
      {
        q: 'Is Cash on Delivery available everywhere?',
        a: 'COD is available for serviceable pincodes. The delivery check tells you whether COD is supported for your address before you order.',
      },
    ],
  },
  {
    category: 'Account & Support',
    icon: 'fa-user-shield',
    items: [
      {
        q: 'Do I need an account to buy?',
        a: 'You can browse and build your cart freely, but an account is required at checkout so we can manage your order, addresses and order history securely.',
      },
      {
        q: 'How do I sign in?',
        a: 'Sign in with your email/username and password, or use “Continue with Google”. New customers can register in seconds from the same window.',
      },
      {
        q: 'How do I manage my addresses?',
        a: 'Go to My Account → Addresses to add, edit, delete or set a default shipping address. You can also check delivery serviceability for a pincode while adding an address.',
      },
      {
        q: 'I forgot my password — what do I do?',
        a: 'On the sign-in screen choose “Forgot password?” and enter your account email. We’ll send a reset link if an account exists for that address.',
      },
    ],
  },
  {
    category: 'About Nelbac',
    icon: 'fa-building',
    items: [
      {
        q: 'Where is Nelbac based?',
        a: 'Nelbac is a technology startup founded in 2020 and headquartered in Bangalore, India.',
      },
      {
        q: 'What does Nelbac do?',
        a: 'We develop next-generation automation controllers for small and marginal farms, urban and vertical home gardens, hydroponics and aquaponics — making farm automation aspirational and accessible for small holders.',
      },
    ],
  },
];
