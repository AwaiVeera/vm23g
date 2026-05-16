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
      title: 'NavaFit Alignment',
      project: 'NavaFit Alignment app',
      category: 'Apps',
      year: 'TBD',
      status: 'Portfolio item pending verification',
      caption: 'Sign-in, tactical flowmentum and Kalari · Gadah disciplines.',
      image: require('@/assets/images/gallery-navafit-app.jpg'),
    },
    {
      title: 'Cocktail Guide app',
      project: 'Cocktail Guide app',
      category: 'Apps',
      year: 'TBD',
      status: '',
      caption: '500+ crafted recipes with step-by-step mixing.',
      image: require('@/assets/images/gallery-cocktail-guide.jpg'),
    },
    {
      title: 'kyanielite.com web design',
      project: 'kyanielite.com',
      category: 'Websites',
      year: '2024',
      status: '',
      caption: 'Kshatriya · Yuga · Atman · Nirvana · Ishvara — talent and lifestyle platform.',
      image: require('@/assets/images/gallery-kyani.jpg'),
    },
    {
      title: 'navafit.sg web design',
      project: 'navafit.sg',
      category: 'Websites',
      year: 'TBD',
      status: '',
      caption: 'NavaFit SG — The Art of Tactical Flow.',
      image: require('@/assets/images/gallery-navafit-sg.jpg'),
    },
    {
      title: 'playroom-sg.com web design',
      project: 'playroom-sg.com',
      category: 'Websites',
      year: '2025',
      status: 'Completed / Ongoing',
      caption: 'Design, marketing and consultancy management for PlayRoom SG.',
      image: require('@/assets/images/gallery-playroom-web.jpg'),
    },
    {
      title: 'Jurong City FC',
      project: 'Jurong City FC Sponsorship',
      category: 'Collaborations',
      year: '2026',
      status: 'Networking / Brand Awareness',
      caption: 'Sponsorship. Pending: trial fitness regime.',
      image: require('@/assets/images/gallery-jurong-fc.jpg'),
    },
    {
      title: 'AI workflow automation diagrams',
      project: 'AaVisions — Workflow Automation',
      category: 'AaVisions',
      year: 'TBD',
      status: 'Generative AI · For event organisers',
      caption: 'Agentic AI workflow automation diagrams for live event operations.',
      image: require('@/assets/images/gallery-navafit-session.jpg'),
    },
    {
      title: 'AaVisions — Media Development',
      project: 'AaVisions',
      category: 'AaVisions',
      year: '2025',
      status: 'Concept',
      caption: 'Videography, edits, music composing and brand logo work for PlayRoom, NavaFit, and Kyani.',
      image: require('@/assets/images/vm23g-logo.png'),
    },
  ],
} as const;

export const legalPageContent = {
  heading: 'Legal Hub',
  subheading:
    'Singapore-focused legal template for VM23G website policies. This template should be reviewed by a qualified Singapore lawyer before publication.',
  lastUpdated: '17 May 2026',
  templateNotice:
    'This page is a general website legal template and should be reviewed by a qualified Singapore lawyer before publication.',
  legalEntity: {
    legalEntityName: 'VM23 Group',
    tradingName: 'NavaFit, AaVisions',
    uen: '\u2014',
    registeredAddress: '1 Claymore Drive #14-02, Singapore 229594',
    contactEmail: 'summan@Veeramisir.com',
    dpoContact: 'summan@Veeramisir.com',
    governingLaw: 'Republic of Singapore',
    paymentTerms:
      'Project services are billed by written quotation, proposal or invoice. A 50% commencement payment is required before work begins, with the remaining balance due before final handover, publication, deployment or delivery, unless a separate written agreement states otherwise. Coaching, wellness sessions and packages are payable in advance before the first session. Monthly retainers and subscriptions are billed in advance. Third-party costs, software, advertising spend, hosting, stock assets, app-store fees, payment-gateway charges and external contractor costs are payable by the client unless expressly included in writing. VM23 Group may pause work, delivery or access if invoices remain unpaid.',
    refundPolicy:
      'Commencement payments, deposits and fees for work already started are non-refundable once strategy, design, consultation, coaching, AI workflow, development, media creation, content, campaign planning or custom production has begun. Delivered digital assets, completed sessions, custom creative work, app-related purchases, third-party costs and no-shows are non-refundable. Unused prepaid coaching sessions may be rescheduled or converted to credit when at least 24 hours notice is given, subject to availability and use within 90 days. Refunds required by law will be honoured. Any goodwill refund or credit is at VM23 Group\u2019s discretion and must be confirmed in writing.',
    coachingDisclaimer:
      'NavaFit Alignment provides wellness, movement, breathwork, physical alignment and performance education. It is not medical advice, physiotherapy, psychiatric care, emergency care, nutritional prescription or a substitute for treatment by a qualified healthcare professional. Clients are responsible for disclosing injuries, surgeries, pregnancy, medical conditions, medications and movement restrictions before participation. Clients should seek medical clearance where appropriate, especially after injury, surgery, chronic illness or transplant-related preparation. Results vary based on health, consistency, recovery, lifestyle and individual circumstances.',
    aiServicesDisclaimer:
      'AaVisions and VM23 Group may use AI-assisted tools for research, ideation, automation, design, copy, code, media generation, workflow planning and productivity. AI outputs may contain errors, bias, outdated information or incomplete assumptions and must be reviewed by humans before use. VM23 Group does not guarantee search rankings, ad results, app-store approval, business revenue, legal compliance, financial outcomes, platform approval, health outcomes or creative acceptance. The client remains responsible for final approval of public claims, regulated content, uploaded data, intellectual property rights and platform compliance.',
    dataRetentionPeriod:
      'Personal data is retained only for as long as necessary for the purpose collected, for legitimate business/legal needs, or as required by Singapore law. General enquiries may be retained for up to 24 months after the last interaction. Client, invoice, accounting, project and contract records may be retained for at least 5 years to meet Singapore record-keeping expectations. Coaching and wellness notes may be retained for up to 5 years after the last session unless a longer period is required or agreed. Marketing consent records are retained until consent is withdrawn, plus a reasonable suppression period to prevent accidental re-contact. Data no longer required will be deleted, anonymised or securely archived.',
    thirdPartyProcessors:
      'VM23 Group may use trusted third-party platforms where needed to operate the business, deliver services and communicate with clients. These may include website hosting and domain providers, cloud storage, Google Workspace or equivalent productivity tools, Apple/iCloud services, WhatsApp Business, Meta platforms, email/CRM systems, payment gateways or bank-transfer providers, app-store platforms, analytics platforms, project-management tools, AI platforms, design/media tools and external specialist contractors under confidentiality or service terms.',
    analyticsTools:
      'Website and campaign analytics may use Google Analytics 4, Google Search Console, Meta Pixel or Meta Business tools, platform-native analytics from Instagram, Facebook, TikTok, LinkedIn, Apple App Store Connect and Google Play Console, plus website-hosting or app analytics where enabled. Analytics are used to understand traffic, performance, campaign response, user journeys, technical issues and content effectiveness.',
    marketingTools:
      'Marketing may be managed through Meta Business Suite, Meta Ads Manager, Google Ads, WhatsApp Business, Instagram, Facebook, TikTok, LinkedIn, email/CRM platforms, scheduling tools, landing pages, lead forms and creative/media tools. Marketing communications are sent only where there is consent, an existing business relationship, or another lawful basis under applicable Singapore rules.',
    cookieTools:
      'The website may use essential cookies for security, page loading and core site functions. Analytics and marketing cookies may be used only where enabled to measure traffic, improve services, support ads and understand visitor behaviour. A cookie banner or consent-management tool such as CookieYes or an equivalent platform should be used where non-essential cookies are deployed. Visitors may control cookies through browser settings and available consent controls.',
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
      body: [
        'General contact email: summan@Veeramisir.com',
        'Data Protection Officer contact: summan@Veeramisir.com',
      ],
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
