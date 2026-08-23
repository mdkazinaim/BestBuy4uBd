import React from 'react';
import { Helmet } from 'react-helmet';
import { useGetHost } from '@/utils/useGetHost';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url }) => {
  const host = useGetHost();

  const getHostnameTitle = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.replace('www.', '');
      const parts = hostname.split('.');
      if (parts.length > 0) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    }
    return 'Store';
  };

  // Use dynamic host config for site identity
  const siteTitle = host?.title || getHostnameTitle();
  const defaultDescription = host?.description || `Your trusted online shopping destination at ${siteTitle}.`;
  const defaultImage = host?.logo || '/logo.png';

  // Construct the full title
  // If the title already includes the site name (or we are on home page where title might just be the site name)
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {url && <meta property="twitter:url" content={url} />}
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;
