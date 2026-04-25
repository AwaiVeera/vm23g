export const site = {
  name: 'VM23G',
} as const;

export const heroContent = {
  title: site.name,
  subtitle: '[Subtitle — confirm copy]',
  primaryCta: '[Primary CTA — confirm label]',
  secondaryCta: '[Secondary CTA — confirm label]',
} as const;

export const servicesContent = {
  heading: '[Services heading — confirm copy]',
  items: [
    { title: '[Service 1 title]', body: '[Service 1 body — confirm copy]' },
    { title: '[Service 2 title]', body: '[Service 2 body — confirm copy]' },
    { title: '[Service 3 title]', body: '[Service 3 body — confirm copy]' },
  ],
} as const;

export const collectivesContent = {
  heading: '[Collectives heading — confirm copy]',
  body: '[Collectives body — confirm copy]',
} as const;

export const galleryContent = {
  heading: '[Gallery heading — confirm copy]',
  items: [
    { label: '[Gallery item 1 — confirm]', caption: '[Caption — confirm]' },
    { label: '[Gallery item 2 — confirm]', caption: '[Caption — confirm]' },
    { label: '[Gallery item 3 — confirm]', caption: '[Caption — confirm]' },
  ],
} as const;

export const partnersContent = {
  heading: '[Partners heading — confirm copy]',
  names: ['[Partner A — confirm]', '[Partner B — confirm]', '[Partner C — confirm]'],
} as const;

export const legalContent = {
  heading: 'Legal',
  body: '[Legal copy — confirm with counsel]',
} as const;

export const aboutContent = {
  heading: 'About',
  body: '[About copy — confirm]',
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
