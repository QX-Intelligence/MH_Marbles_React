import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  canonical?: string;
  breadcrumbs?: { name: string; item: string }[];
  articleData?: {
    publishedTime?: string;
    author?: string;
    section?: string;
  };
  productData?: {
    price?: string;
    currency?: string;
    availability?: string;
    sku?: string;
  };
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/Logo1.png', 
  type = 'website',
  canonical,
  breadcrumbs,
  articleData
}) => {
  const siteName = 'MH MARBLE';

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Visionary Architectural Gallery`;
  const defaultDescription = 'Curators of the earth\'s most exquisite architectural statements for the discerning visionary since 2005.';

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const siteUrl = 'https://www.mhmarble.com';
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "alternateName": ["mhmarble", "m h marble", "mh marble hyderabad"],
    "url": siteUrl,


    "logo": `${siteUrl}/Logo1.png`,
    "description": defaultDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "MH MARBLE, Gandi Maisamma",

      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500043",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9866755272",
      "contactType": "sales",
      "areaServed": "IN",
      "availableLanguage": "English"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": siteUrl,
    "name": siteName,
    "image": fullImage,
    "address": organizationSchema.address,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.587134,
      "longitude": 78.411146
    },
    "url": siteUrl,
    "telephone": organizationSchema.contactPoint.telephone,
    "priceRange": "$$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday"],
        "opens": "09:00",
        "closes": "14:00"
      }
    ]
  };

  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": crumb.name,
      "item": crumb.item.startsWith('http') ? crumb.item : `${siteUrl}${crumb.item}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="keywords" content="mhmarble, mh marble, mh marble hyderabad, quality tiles hyderabad, architectural stone hyderabad, tiles showroom gandi maisamma, vitrified tiles, granite hyderabad" />

      <link rel="icon" type="image/png" href="/Logo1.png" />
      <link rel="shortcut icon" type="image/png" href="/Logo1.png" />

      {canonical && <link rel="canonical" href={canonical} />}


      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@mhmarble" />


      {/* Article Specific */}
      {type === 'article' && articleData && (
        <>
          {articleData.publishedTime && <meta property="article:published_time" content={articleData.publishedTime} />}
          {articleData.author && <meta property="article:author" content={articleData.author} />}
          {articleData.section && <meta property="article:section" content={articleData.section} />}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    </Helmet>
  );
};

export default SEO;
