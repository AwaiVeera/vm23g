import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

const SITE_URL  = 'https://vm23g.com';
const SITE_NAME = 'VM23G';
const SITE_DESCRIPTION =
  'Founded by Awai Veera and Summan Veera, VM23G blends executive business experience with certified expertise in Generative AI design and workflow automation. We design intelligent websites, applications, and operational systems for ambitious companies ready to scale with precision.';
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  legalName: 'VM23G',
  url: SITE_URL,
  logo: `${SITE_URL}/og-cover.jpg`,
  description: SITE_DESCRIPTION,
  foundingLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressCountry: 'SG' },
  },
  founder: [
    {
      '@type': 'Person',
      name: 'Summan Misir Veera',
      jobTitle: 'Founder, Managing Director',
      worksFor: { '@type': 'Organization', name: SITE_NAME },
    },
    {
      '@type': 'Person',
      name: 'Tinesh Awai Veera',
      jobTitle: 'Co-Founder',
      worksFor: { '@type': 'Organization', name: SITE_NAME },
    },
  ],
  knowsAbout: [
    'Generative AI design',
    'AI workflow automation',
    'Web design',
    'Application development',
    'Pose recognition',
    'Movement intelligence',
    'AI-enhanced coaching',
    'Brand architecture',
  ],
  areaServed: 'Worldwide',
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#06070A" />
        <meta name="color-scheme" content="dark" />

        {/* Default title + description (per-route Head will override) */}
        <title>{`${SITE_NAME} — Mind. Body. Brand. Technology.`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={`${SITE_NAME} — Mind. Body. Brand. Technology.`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE_NAME} — Mind. Body. Brand. Technology.`} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD schema for AI engines + search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
