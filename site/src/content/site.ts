export const brand = {
  name: 'VM23G',
  legalName: 'VM23 Group',
  line: 'MIND. BODY. BRAND. TECHNOLOGY.',
  location: 'Singapore',
  domain: 'https://veeramisir.com',
  description:
    'VM23G is a Singapore-based group uniting AI systems, web and app design, brand and media, and movement-led wellness under one disciplined operating layer.',
};

export const nav = [
  { href: '/work', label: 'Work', blurb: 'Websites, apps, media and partnerships we have built.' },
  { href: '/services', label: 'Services', blurb: 'Mind, Body, Brand and Technology — what we do.' },
  { href: '/ai-lab', label: 'AI Lab', blurb: 'Meet V, our AI concierge, and the AI work behind it.' },
  { href: '/founders', label: 'Founders', blurb: 'Summan Misir Veera and Tinesh Awai Veera.' },
  { href: '/ecosystem', label: 'Ecosystem', blurb: 'Ventures, clubs and collaborators that move with us.' },
] as const;

export const startHref = '/start';

export type Pillar = {
  key: 'mind' | 'body' | 'brand' | 'technology';
  index: string;
  title: string;
  arm: string;
  summary: string;
  offers: string[];
  image: string;
  imageAlt: string;
};

export const pillars: Pillar[] = [
  {
    key: 'mind',
    index: '01',
    title: 'Mind',
    arm: 'NavaFit Alignment',
    summary: 'Mind and body alignment programmes that build focus, breath control and composure under pressure.',
    offers: ['Mind/body alignment programmes', 'Breathwork and pranayama', 'AI-enhanced coaching'],
    image: 'work/collective-navafit-app',
    imageAlt: 'NavaFit Alignment app screen showing a daily breathwork wisdom card and a Begin Session button',
  },
  {
    key: 'body',
    index: '02',
    title: 'Body',
    arm: 'NavaFit Alignment',
    summary: 'Real-world strength through physical alignment, movement education and Kalari- and Gadah-inspired training.',
    offers: ['Physical alignment and movement education', 'Kalari and Gadah-inspired training', 'Fitness branding'],
    image: 'work/collective-navafit-training',
    imageAlt: 'A NavaFit Alignment floor movement drill outdoors beside wooden gadah maces',
  },
  {
    key: 'brand',
    index: '03',
    title: 'Brand',
    arm: 'AaVisions',
    summary: 'Brand direction, media and commercial strategy for founders who want to be remembered.',
    offers: ['Sales and performance consultations', 'Videography, edits and music composing', 'Brand and logo work'],
    image: 'work/gallery-kyani',
    imageAlt: 'kyanielite.com website with a black-and-white talent gallery',
  },
  {
    key: 'technology',
    index: '04',
    title: 'Technology',
    arm: 'AaVisions',
    summary: 'Websites, apps and agentic AI workflows engineered to move a business faster.',
    offers: ['Web design and app development', 'AI workflow automation', 'UI/UX design and digital transformation'],
    image: 'work/gallery-navafit-app',
    imageAlt: 'NavaFit Alignment iOS app home screen with Kalari, Gadah and Breathwork disciplines',
  },
];

export const founders = [
  {
    slug: 'summan-misir-veera',
    name: 'Summan Misir Veera',
    role: 'Founder, Managing Director',
    venture: 'AaVisions',
    ventureFocus: 'Tech, AI, web, app and marketing consulting',
    bio: 'Elite sales instinct, commercial discipline, and high-conversion strategy. Leads brand direction, partnerships, and growth across the VM23G group.',
    ventureNote:
      'Practical, execution-focused use of agentic AI to accelerate delivery and business outcomes — from creating studio-quality music, to making movies, to a storybook for kids.',
    ventureOffers: ['Web design and app development', 'Sales and performance consultations', 'AI workflow automation', 'UI/UX design and digital transformation'],
    portrait: 'summan-corporate',
    social: [{ label: 'Instagram', handle: '@summanmisirveera', href: 'https://www.instagram.com/summanmisirveera/' }],
  },
  {
    slug: 'tinesh-awai-veera',
    name: 'Tinesh Awai Veera',
    role: 'Co-founder',
    venture: 'NavaFit Alignment',
    ventureFocus: 'Mind and body wellness',
    bio: '18+ years in nightlife, leadership, and revenue transformation, scaling venues from modest turnover to multimillion-dollar performance. Drives operational systems, AI-enhanced coaching, and movement intelligence.',
    ventureNote: 'Testimonials from ACL patient to organ donor.',
    ventureOffers: [
      'Fitness branding',
      'Physical alignment and movement education',
      'Mind/body alignment programmes',
      'Real-world strength, breathwork, Kalari/Gadah/Breathwork-inspired training with modern results',
    ],
    portrait: 'tinesh-corporate',
    social: [
      { label: 'Instagram', handle: '@awai.veera', href: 'https://www.instagram.com/awai.veera/' },
      { label: 'TikTok', handle: '@awai.veera', href: 'https://www.tiktok.com/@awai.veera' },
    ],
  },
] as const;

export const press = [
  {
    publication: 'Yahoo Finance',
    title: "Tinesh Awai Veera: Guided by Ayyappan's Grace, Building His Own Path",
    date: '2026-09-17',
    classification: 'Press release · distributed by ACCESS Newswire',
    summary:
      'A Singapore founder story tracing a seven-year journey across NavaFit Alignment, VM23 Group and hospitality ventures.',
    href: 'https://finance.yahoo.com/small-business/articles/tinesh-awai-veera-guided-ayyappans-100000035.html',
  },
  {
    publication: "Men's Insider",
    title: 'Tinesh Awai Veera Builds Strength Through Reinvention',
    date: '2026-08-27',
    classification: 'Contributor feature',
    summary: 'A profile of a Singapore strength coach, creator and iOS app developer blending warrior-inspired and modern training.',
    href: 'https://mensinsider.com/tinesh-awai-veera-builds-strength-through-reinvention/',
  },
  {
    publication: 'ACCESS Newswire',
    title: "Tinesh Awai Veera: Guided by Ayyappan's Grace, Building His Own Path",
    date: '2026-09-17',
    classification: 'Original press release',
    summary: 'The original release behind the Yahoo Finance syndication.',
    href: 'https://www.accessnewswire.com/newsroom/en/business-and-professional-services/tinesh-awai-veera-guided-by-ayyappans-grace-building-his-own-pat-1220153',
  },
] as const;

export const projects = [
  {
    slug: 'navafit-alignment-app',
    title: 'NavaFit Alignment',
    kind: 'iOS app',
    category: 'Apps',
    year: '2026',
    summary: 'A training app pairing a lap-tracking workout timer and guided breathwork with an in-app guide for Kalaripayattu, Gadah and pranayama.',
    image: 'gallery-navafit-app',
    href: 'https://apps.apple.com/sg/app/navafit-alignment/id6761351480',
    linkLabel: 'View on the App Store',
  },
  {
    slug: 'kyanielite',
    title: 'kyanielite.com',
    kind: 'Website',
    category: 'Websites',
    year: '2024',
    summary: 'Kshatriya · Yuga · Atman · Nirvana · Ishvara — a talent and lifestyle platform.',
    image: 'gallery-kyani',
    href: 'https://kyanielite.com',
    linkLabel: 'Visit site',
  },
  {
    slug: 'navafit-sg',
    title: 'navafit.sg',
    kind: 'Website',
    category: 'Websites',
    year: '',
    summary: 'NavaFit SG — The Art of Tactical Flow.',
    image: 'gallery-navafit-sg',
    href: 'https://navafit.sg',
    linkLabel: 'Visit site',
  },
  {
    slug: 'playroom-sg',
    title: 'playroom-sg.com',
    kind: 'Website, marketing and consultancy',
    category: 'Websites',
    year: '2025',
    summary: 'Design, marketing and consultancy management for PlayRoom SG.',
    image: 'gallery-playroom-web',
    href: 'https://playroom-sg.com',
    linkLabel: 'Visit site',
  },
  {
    slug: 'cocktail-guide',
    title: 'Cocktail Guide',
    kind: 'App',
    category: 'Apps',
    year: '',
    summary: '500+ crafted recipes with step-by-step mixing.',
    image: 'gallery-cocktail-guide',
    href: '',
    linkLabel: '',
  },
  {
    slug: 'jurong-city-fc',
    title: 'Jurong City FC',
    kind: 'Sponsorship',
    category: 'Collaborations',
    year: '2026',
    summary: 'Club sponsorship for networking and brand awareness.',
    image: 'gallery-jurong-fc',
    href: '',
    linkLabel: '',
  },
] as const;

export const ecosystem = [
  { key: 'navafit-training', title: 'NavaFit Alignment', tag: 'Movement & Coaching', caption: 'Real-world strength, breathwork, Kalari & Gadah-inspired training.', image: 'collective-navafit-training', href: 'https://navafit.sg' },
  { key: 'navafit-app', title: 'NavaFit App', tag: 'Tech & AI', caption: 'AI-enhanced coaching with pose recognition and connected core tracking.', image: 'collective-navafit-app', href: 'https://apps.apple.com/sg/app/navafit-alignment/id6761351480' },
  { key: 'playroom', title: 'PlayRoom SG', tag: 'Venue & Lifestyle', caption: 'Nightlife destination in Singapore.', image: 'collective-playroom', href: 'https://playroom-sg.com' },
  { key: 'jurong-fc', title: 'Jurong Football Club', tag: 'Sports Partnership', caption: 'Sports partnership, sponsorship, and community football.', image: 'collective-jurong-fc', href: '' },
  { key: 'navanagas', title: 'Navanagas Hub', tag: 'Charity Initiative', caption: 'Charity initiatives and community provisioning across Singapore and overseas.', image: 'collective-charity', href: '' },
  { key: 'heritage', title: 'Heritage & Roots', tag: 'Founders’ Story', caption: 'The cultural foundation guiding VM23G’s mind, body, and discipline.', image: 'collective-heritage', href: '' },
] as const;

export const channels = [
  { label: 'NavaFit Alignment on Telegram', owner: 'NavaFit Alignment', href: 'https://t.me/navafitalignment' },
  { label: 'NavaFit Alignment on the App Store', owner: 'NavaFit Alignment', href: 'https://apps.apple.com/sg/app/navafit-alignment/id6761351480' },
] as const;

export const contact = {
  studioEmail: 'summan@veeramisir.com',
  navafitEmail: 'awaiveera@navafit.sg',
};
