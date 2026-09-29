export const types = ['Corporate', 'E-commerce', 'Portfolio', 'Restaurant', 'Real estate', 'School', 'Landing page', 'Booking website', 'Custom'];
export const features = ['Contact form', 'WhatsApp', 'M-Pesa', 'Card payments', 'Booking', 'Maps', 'Blog', 'Analytics', 'SEO', 'Customer accounts', 'Multilingual'];
export const styles = ['Minimal', 'Corporate', 'Luxury', 'Bold', 'Creative', 'Technology', 'Dark', 'Elegant'];
export const stages = ['Your Business', 'Website Type', 'Website Requirements', 'Design Direction', 'Branding', 'Content', 'Domain & Hosting', 'Review & Submit'];
export const projectStates = ['New', 'Assigned', 'Designing', 'Development', 'Client Review', 'Changes', 'Ready', 'Live', 'On hold', 'Cancelled'];
export const services = [
  ['Brand identity', 'A distinctive first impression.', 'Logo concepts, a considered color system, typography and clear brand direction.', 'PenTool'],
  ['Website design', 'Designed around your business.', 'Thoughtful wireframes and refined interfaces, across desktop, tablet and mobile.', 'PanelsTopLeft'],
  ['Development', 'Beautiful outside. Capable inside.', 'Responsive business websites, landing pages, portfolios and blogs.', 'Code2'],
  ['E-commerce', 'Turn browsing into buying.', 'Product catalogs, carts, checkout, payments and order management.', 'ShoppingBag'],
  ['Custom applications', 'Built for the way you work.', 'Portals, dashboards, marketplaces, booking systems and business tools.', 'Blocks'],
  ['Content creation', 'The right words for your website.', 'Headlines, website copy and product or service descriptions.', 'FileText'],
  ['Graphics & assets', 'Every detail belongs.', 'Banners, icons and launch graphics that work with your identity.', 'Shapes'],
  ['Domains & hosting', 'A home for your business online.', 'Domain assistance, DNS, hosting, SSL and deployment.', 'Globe'],
  ['Business email', 'Make every message professional.', 'Email setup on your domain, with clearly scoped mailbox and migration needs.', 'Mail'],
  ['Payments & integrations', 'Bring your tools together.', 'M-Pesa, cards, WhatsApp, maps, CRM and third-party services.', 'Workflow'],
  ['SEO & analytics', 'Be found. Understand what works.', 'Technical SEO, metadata, sitemaps and conversion measurement.', 'ChartNoAxesCombined'],
  ['Maintenance & support', 'Look after what you’ve built.', 'Updates, backups, monitoring, fixes and ongoing technical assistance.', 'ShieldCheck'],
];
export const packages = [
  { name: 'CWS Start', tagline: 'Your first step online.', items: ['A focused professional website', 'Responsive design', 'Contact & WhatsApp integration', 'Launch and deployment'], label: 'A strong beginning' },
  { name: 'CWS Business', tagline: 'Room for your business to grow.', items: ['Expanded pages & features', 'Branding & design direction', 'SEO & analytics setup', 'Domain & hosting setup'], label: 'The complete presence' },
  { name: 'CWS Commerce', tagline: 'Open for business. Everywhere.', items: ['Product catalog & cart', 'Checkout & payments', 'Order management', 'A scoped launch timeline'], label: 'Made for selling' },
  { name: 'CWS Custom', tagline: 'Your ambition, engineered.', items: ['Portals & dashboards', 'Marketplaces & SaaS', 'Custom integrations', 'Discovery & tailored delivery'], label: 'Beyond the ordinary' },
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
