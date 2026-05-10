export const site = {
  name: 'VM23G',
} as const;

export const vm23gProfile = {
  companyName: 'VM23G',
  operatingLocation: 'Singapore',
  ssic: {
    primary: {
      code: '70205',
      description: 'Public relations, marketing, and brand consultancy services.',
    },
    secondary: {
      code: '85409',
      description: 'Training courses n.e.c. / coaching.',
    },
  },
  objective:
    'Structure VM23G as a clear umbrella identity that guides visitors to the right service arm without brand confusion.',
} as const;

export const businessArms = {
  umbrella: {
    name: 'VM23G',
    role: 'Umbrella group',
    positioning:
      'Mind, body, brand, and intelligent technology operating together as one strategic ecosystem.',
  },
  navaFitAlignment: {
    name: 'NavaFit Alignment',
    role: 'Mind and Body Wellness',
    leadership: 'Founded and led by Tinesh Awai Veera (mind/body alignment Guru).',
    focus: [
      'Fitness branding',
      'Physical alignment and movement education',
      'Mind/body alignment programmes',
      'Real-world strength, breathwork, Kalari/Gadah/Breathwork-inspired training with modern results',
    ],
    brandEnergy:
      'Testimonials from ACL patient to organ donor.',
  },
  aaVisions: {
    name: 'AAVisions',
    role: 'Tech, AI, Web, App, and Marketing Consulting',
    leadership: 'Led by Summan Misir Veera.',
    focus: [
      'Web design and app development',
      'Sales and performance consultations',
      'AI workflow automation',
      'UI/UX design and digital transformation',
    ],
    differentiator:
      'Practical, execution-focused use of agentic AI to accelerate delivery and business outcomes — from creating studio-quality music, to making movies, to a storybook for kids.',
  },
} as const;

export const verificationLabels = {
  pending: 'Portfolio item pending verification',
  tbd: 'TBD',
} as const;

export const aboutPageContent = {
  hero: {
    title: 'Mind. Body. Brand. Technology.',
    subtitle:
      'A Singapore-based group aligning physical discipline, AI systems, design, and marketing into one operating force.',
    ctas: ['Explore NavaFit Alignment', 'Explore AaVisions'],
  },
  whoWeAre:
    'Founded by Awai Veera and Summan Veera, VM23G blends executive business experience with certified expertise in Generative AI design and workflow automation. We design intelligent websites, applications, and operational systems for ambitious companies ready to scale with precision. Our work fuses fitness innovation, machine learning, and AI-enhanced coaching, including pose-recognition technology that studies movement data to improve form and performance. Awai brings 18+ years in nightlife, leadership, and revenue transformation, scaling venues from modest turnover to multimillion-dollar performance. Summan brings elite sales instinct, commercial discipline, and high-conversion strategy. Together, we build premium AI-driven systems for brands that refuse ordinary growth.',
  qualifications: [
    '18 years in the entertainment industry, 15 years in sales — drawing commissions that hit 5 figures, to turning 25k revenue into 125k within 60 days — are just the foundation, backed by an array of network and resources from Singapore to Europe. Recently embarked on and certified by Vertical Institute.',
  ],
  proofExperience: [
    { label: 'PlayRoom Singapore', status: verificationLabels.pending },
    { label: 'kyanielite.com', status: verificationLabels.pending },
    { label: 'playroom-sg.com', status: verificationLabels.pending },
    { label: 'navafit.sg', status: verificationLabels.pending },
    { label: 'NavaFit Alignment app (Apple App Store)', status: verificationLabels.pending },
    { label: 'Cocktail Guide app (Apple App Store)', status: verificationLabels.pending },
    { label: 'Creator, football club, and large-company collaborations', status: verificationLabels.pending },
  ],
  leadership: [
    {
      name: 'Summan Misir Veera',
      role: 'Founder, Managing Director',
      note: 'Elite sales instinct, commercial discipline, and high-conversion strategy. Leads brand direction, partnerships, and growth across the VM23G group.',
      portrait: require('@/assets/images/founder-summan.jpg'),
      armKey: 'aaVisions' as const,
    },
    {
      name: 'Tinesh Awai Veera',
      role: 'Co-Founder',
      note: '18+ years in nightlife, leadership, and revenue transformation, scaling venues from modest turnover to multimillion-dollar performance. Drives operational systems, AI-enhanced coaching, and movement intelligence.',
      portrait: require('@/assets/images/founder-tinesh.jpg'),
      armKey: 'navaFitAlignment' as const,
    },
  ],
} as const;

export const collectivesContent = {
  heading: 'The Collective Moves Together.',
  body: 'A growing network of creators, coaches, clubs, venues, sponsors, builders, and community allies.',
} as const;

export const collectivesPageContent = {
  hero: {
    title: 'The Collective Moves Together.',
    brandLine: 'NAVAFIT ALIGNMENT  ·  PLAYROOM SG  ·  KYANI  ·  NAVANAGAS HUB',
  },
  intro:
    'We collaborate with organizations such as Jurong Football Club, athletes such as Blackcat Movement, and overseas training and experience as near as Banaras and as far as Batumi, Georgia. With career opportunities such as modeling, digital creation, and many more.',
  ecosystem:
    'An eco-system of live creators, athletes, venues, clubs, sponsors, educators, resource providers, charity initiatives, and collaborators.',
  mission:
    'This space is reserved for people and organisations aligned with our mission: better bodies, sharper minds, stronger brands, and technology that serves real human progress.',
  featureTiles: [
    {
      key: 'playroom',
      title: 'PlayRoom SG',
      caption: 'Premier gentleman\u2019s bar and nightlife destination.',
      tag: 'Venue & Lifestyle',
      image: require('@/assets/images/collective-playroom.jpg'),
    },
    {
      key: 'navafit-training',
      title: 'NavaFit Alignment',
      caption: 'Real-world strength, breathwork, Kalari & Gadah-inspired training.',
      tag: 'Movement & Coaching',
      image: require('@/assets/images/collective-navafit-training.jpg'),
    },
    {
      key: 'navafit-app',
      title: 'NavaFit App',
      caption: 'AI-enhanced coaching with pose recognition and connected core tracking.',
      tag: 'Tech & AI',
      image: require('@/assets/images/collective-navafit-app.jpg'),
    },
    {
      key: 'jurong-fc',
      title: 'Jurong Football Club',
      caption: 'Sports partnership, sponsorship, and community football.',
      tag: 'Sports Partnership',
      image: require('@/assets/images/collective-jurong-fc.jpg'),
    },
    {
      key: 'navanagas',
      title: 'Navanagas Hub',
      caption: 'Charity initiatives and community provisioning across Singapore and overseas.',
      tag: 'Charity Initiative',
      image: require('@/assets/images/collective-charity.jpg'),
    },
    {
      key: 'heritage',
      title: 'Heritage & Roots',
      caption: 'The cultural foundation guiding VM23G\u2019s mind, body, and discipline.',
      tag: 'Founders\u2019 Story',
      image: require('@/assets/images/collective-heritage.jpg'),
    },
  ],
} as const;

export const galleryContent = {
  heading: 'Gallery of Movement, Design & Execution.',
  items: [
    { label: 'PlayRoom Singapore campaign visuals', caption: verificationLabels.pending },
    { label: 'NavaFit Alignment app screenshots', caption: verificationLabels.pending },
    { label: 'Cocktail Guide app screenshots', caption: verificationLabels.pending },
  ],
} as const;

export const galleryPageContent = {
  hero: {
    title: 'Gallery of Movement, Design & Execution.',
    subtitle:
      'A visual archive of VM23G projects, people, places, apps, campaigns, and collaborations.',
  },
  filters: [
    'All',
    'NavaFit Alignment',
    'AaVisions',
    'Events',
    'Apps',
    'Websites',
    'Campaigns',
    'Collaborations',
    'Behind The Scenes',
  ],
  items: [
    {
      title: 'PlayRoom Singapore campaign visuals',
      project: 'PlayRoom Singapore',
      category: 'Campaigns',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'NavaFit Alignment app screenshots',
      project: 'NavaFit Alignment app',
      category: 'Apps',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'Cocktail Guide app screenshots',
      project: 'Cocktail Guide app',
      category: 'Apps',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'kyanielite.com web design',
      project: 'kyanielite.com',
      category: 'Websites',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'navafit.sg web design',
      project: 'navafit.sg',
      category: 'Websites',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'playroom-sg.com web design',
      project: 'playroom-sg.com',
      category: 'Websites',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'Creator collaboration visuals',
      project: 'Creator Collaborations',
      category: 'Collaborations',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'Football club collaboration visuals',
      project: 'Football Clubs',
      category: 'Collaborations',
      year: 'TBD',
      status: verificationLabels.pending,
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'AI workflow automation diagrams',
      project: 'AaVisions',
      category: 'AaVisions',
      year: 'TBD',
      status: 'Concept',
      caption: 'TBD',
      asset: 'Placeholder',
    },
    {
      title: 'Brand identity mockups',
      project: 'VM23G',
      category: 'Behind The Scenes',
      year: 'TBD',
      status: 'In Progress',
      caption: 'TBD',
      asset: 'Placeholder',
    },
  ],
} as const;

export const legalPageContent = {
  heading: 'Legal Hub',
  subheading:
    'Singapore-focused legal template for VM23G website policies. This template should be reviewed by a qualified Singapore lawyer before publication.',
  lastUpdated: 'TBD',
  templateNotice:
    'This page is a general website legal template and should be reviewed by a qualified Singapore lawyer before publication.',
  legalEntity: {
    legalEntityName: 'TBD',
    tradingName: 'VM23G / VeeraMisir23 Group',
    uen: 'TBD',
    registeredAddress: 'TBD',
    contactEmail: 'TBD',
    dpoContact: 'TBD',
    governingLaw: 'Singapore',
    paymentTerms: 'TBD',
    refundPolicy: 'TBD',
    coachingDisclaimer: 'TBD',
    aiServicesDisclaimer: 'TBD',
    dataRetentionPeriod: 'TBD',
    thirdPartyProcessors: 'TBD',
    analyticsTools: 'TBD',
    marketingTools: 'TBD',
    cookieTools: 'TBD',
  },
  sections: [
    {
      key: 'overview',
      title: 'Legal Overview',
      body: [
        'VM23G operates as an umbrella brand connecting NavaFit Alignment (coaching/fitness services) and AaVisions (technology/design/marketing services).',
        'Service-specific proposals, statements of work, and signed contracts may override general website terms where explicitly stated.',
      ],
    },
    {
      key: 'terms',
      title: 'Terms & Conditions',
      body: [
        'Website use is permitted only for lawful and legitimate purposes.',
        'Services include coaching and fitness-alignment services via NavaFit Alignment, and web/app/AI/design/marketing services via AaVisions.',
        'No guaranteed fitness, business, legal, marketing, financial, or technical outcomes are promised.',
        'Portfolio display rights, payment terms, cancellations, and refunds: TBD.',
        'External links and third-party tools may be provided for convenience and remain subject to their own terms.',
        'Governing law and dispute handling jurisdiction: Singapore.',
      ],
    },
    {
      key: 'privacy',
      title: 'Privacy Policy',
      body: [
        'Personal data collected, methods of collection, and purposes of collection are documented as part of this template.',
        'Consent, withdrawal of consent, access, and correction request workflows should align with PDPA obligations.',
        'Protection, retention limitation, transfer limitation, and breach-response contact process are included as template placeholders pending operational confirmation.',
        'Cross-border transfer details and processor list: TBD.',
      ],
    },
    {
      key: 'cookies',
      title: 'Cookie Notice',
      body: [
        'This site may use essential, analytics, and marketing cookies.',
        'Embedded third-party content can set additional cookies under their own policies.',
        'Cookie preference management tool: TBD.',
      ],
    },
    {
      key: 'disclaimer',
      title: 'Disclaimer',
      body: [
        'Fitness/coaching content is general in nature and not medical advice.',
        'Users should seek qualified healthcare advice before starting fitness or movement programs where appropriate.',
        'Technology, AI, design, and marketing materials are provided without guaranteed outcomes.',
        'Portfolio items may include concepts, works in progress, or entries pending verification unless explicitly marked live.',
      ],
    },
    {
      key: 'acceptable-use',
      title: 'Acceptable Use',
      body: [
        'No unlawful use, abusive submissions, scraping, impersonation, harassment, malicious uploads, or intellectual-property infringement is permitted.',
        'Form usage and communication channels must not be used to submit harmful or deceptive content.',
      ],
    },
    {
      key: 'contact',
      title: 'Contact / Data Protection Contact',
      body: ['General contact email: TBD.', 'Data Protection Officer contact: TBD.'],
    },
  ],
  singaporeSources: [
    'PDPC: Personal Data Protection Act (PDPA) and Data Protection Obligations.',
    'PDPC: Do Not Call Registry and business rules.',
    'Singapore Statutes Online: PDPA and Consumer Protection (Fair Trading) Act.',
    'SingStat SSIC 2020 references for 70205 and 85409.',
  ],
} as const;

export const authorityContent = {
  microLabel: 'OPERATING LAYER',
  headline: 'Built For Brands That Refuse Average.',
  body: 'VM23G combines AI systems, digital design, media production, and human performance into one disciplined operating layer for individuals, founders, and enterprise teams.',
  pillars: [
    { number: '01', title: 'Intelligence Systems' },
    { number: '02', title: 'Brand & Media Architecture' },
    { number: '03', title: 'Physical + Mental Performance' },
  ],
} as const;

export const proofMetricsContent = {
  microLabel: 'PROOF',
  items: [
    { value: '23G',  label: 'Operating Nodes' },
    { value: '∞',    label: 'Iteration Mindset' },
    { value: 'AI',   label: 'Systems Layer' },
    { value: '360°', label: 'Brand Execution' },
  ],
} as const;

export const clientPathwayContent = {
  microLabel: 'PATHWAY',
  heading: 'How We Engage.',
  steps: [
    { number: '01', title: 'Diagnose',  body: 'We identify the pressure points in your brand, system, body, or operating model.' },
    { number: '02', title: 'Architect', body: 'We design the structure, experience, and intelligence layer required to move forward.' },
    { number: '03', title: 'Build',     body: 'We execute across web, app, AI workflow, media, and performance systems.' },
    { number: '04', title: 'Scale',     body: 'We refine, measure, and compound the system until it becomes difficult to ignore.' },
  ],
} as const;

export const trustArchitectureContent = {
  microLabel: 'STANDARD',
  heading: 'Why Founders Trust The Build.',
  cards: [
    { label: 'STRATEGIC DEPTH',  body: 'Every build begins with diagnosis, structure, and intent before visuals are touched.' },
    { label: 'EXECUTION RANGE',  body: 'VM23G moves across AI systems, app/web design, video, brand direction, and performance culture.' },
    { label: 'PRIVATE STANDARD', body: 'High-value work is handled with discretion, discipline, and founder-level attention.' },
  ],
} as const;

export const premiumCTAContent = {
  microLabel: 'ENTER THE SYSTEM',
  headline: 'If The Work Matters, Build It Properly.',
  body: 'For founders, brands, creators, and teams ready to combine intelligence, identity, media, and human performance into one sharper operating system.',
  primaryLabel: 'Request Private Consultation',
  secondaryLabel: 'View Collectives',
} as const;
