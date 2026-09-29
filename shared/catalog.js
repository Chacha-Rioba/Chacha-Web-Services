export const types = ['Corporate', 'E-commerce', 'Portfolio', 'Restaurant', 'Real estate', 'School', 'Landing page', 'Booking website', 'Custom'];
export const features = ['Contact form', 'WhatsApp', 'M-Pesa', 'Card payments', 'Booking', 'Maps', 'Blog', 'Analytics', 'SEO', 'Customer accounts', 'Multilingual'];
export const styles = ['Minimal', 'Corporate', 'Luxury', 'Bold', 'Creative', 'Technology', 'Dark', 'Elegant'];
export const stages = ['Your Business', 'Website Type', 'Website Requirements', 'Design Direction', 'Branding', 'Content', 'Domain & Hosting', 'Review & Submit'];
export const projectStates = ['New', 'Assigned', 'Designing', 'Development', 'Client Review', 'Changes', 'Ready', 'Completed', 'Live', 'On hold', 'Cancelled'];
export const services = [
  [
    "Website design & development",
    "Your strongest first impression.",
    "Fast, expressive websites with clear journeys from first visit to inquiry."
  ],
  [
    "Web applications",
    "Turn your idea into a working product.",
    "Customer portals, subscriptions and browser-based tools built around your users."
  ],
  [
    "E-commerce",
    "Make your next sale online.",
    "Product discovery, inventory, checkout and payment connections for your store."
  ],
  [
    "Business systems",
    "Give your team a better way to work.",
    "Internal dashboards, records and approval flows tailored to daily operations."
  ],
  [
    "Mobile experiences",
    "Meet customers on their screen.",
    "Responsive products and scoped mobile application projects, from prototype to release."
  ],
  [
    "Payments & integrations",
    "Connect the tools behind your business.",
    "M-Pesa, payment providers, messaging and external APIs brought into one customer journey."
  ],
  [
    "UX & product design",
    "Make every interaction count.",
    "User journeys, interactive prototypes and interfaces tested against real tasks."
  ],
  [
    "Workflow automation",
    "Make repetitive work run smoother.",
    "Lead routing, notifications and connected business workflows with clear controls."
  ],
  [
    "Branding & creative",
    "Build a brand people recognize.",
    "Logo design, visual identity, website copy and campaign-ready graphic assets."
  ],
  [
    "SEO & digital growth",
    "Help the right customers find you.",
    "Search foundations, content planning and analytics to understand your next opportunity."
  ],
  [
    "Cloud, domains & email",
    "Put your business on solid foundations.",
    "Domain setup, deployment, hosting and professional email with agreed ownership and renewals."
  ],
  [
    "Maintenance & support",
    "Keep moving after launch.",
    "Updates, backups, monitoring and improvements through a scoped support plan."
  ]
];
export const packages = [
  { name: 'Launch Presence', tagline: 'Your first step online.', items: ['A focused professional website', 'Responsive design', 'Contact & WhatsApp integration', 'Launch and deployment'], label: 'A strong beginning' },
  { name: 'Business Growth', tagline: 'Room for your business to grow.', items: ['Expanded pages & features', 'Branding & design direction', 'SEO & analytics setup', 'Domain & hosting setup'], label: 'The complete presence' },
  { name: 'Commerce Engine', tagline: 'Open for business. Everywhere.', items: ['Product catalog & cart', 'Checkout & payments', 'Order management', 'A scoped launch timeline'], label: 'Made for selling' },
  { name: 'Custom Platform', tagline: 'Your ambition, engineered.', items: ['Portals & dashboards', 'Marketplaces & SaaS', 'Custom integrations', 'Discovery & tailored delivery'], label: 'Beyond the ordinary' },
];
export const faq = [
  ['Can my website really go live in five hours?', 'The fast-delivery service applies to eligible standard websites once your scope, assets, required payment and delivery slot are confirmed. Commerce, custom applications and complex integrations receive their own timeline.'],
  ['What do I need before we start?', 'Tell us about your business, choose the pages and features you need, and share any available logo, copy and images. You can also ask CWS to create branding and content for you.'],
  ['Can you design my logo too?', 'Yes. Choose a new logo, a refreshed identity or a complete brand identity during your project brief. Branding is included in the agreed project scope.'],
  ['Do you provide domains and hosting?', 'Yes. We can help with your domain, hosting, SSL and professional email. Ownership, renewals and ongoing costs are made clear in your quote.'],
  ['How much will my website cost?', 'Your package, pages, features and add-ons determine your quote. Until a price is agreed, submitting a brief does not charge you or start paid work.'],
  ['What happens after I submit?', 'Your brief receives a project reference and is reviewed by CWS. Sign in with the same email to follow your project, share information and respond to the team.'],
];
export const slug = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
