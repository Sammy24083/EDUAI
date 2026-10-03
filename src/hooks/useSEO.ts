import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
}

export function useSEO({
  title,
  description,
  image,
  canonicalUrl,
  type = 'website',
  author,
  publishedTime,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const defaultTitle = 'EduAI — Modern Technology & Artificial Intelligence Publication';
    const finalTitle = title ? `${title} | EduAI` : defaultTitle;
    document.title = finalTitle;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const finalDesc = description || 'A modern editorial publication on AI engineering, autonomous agents, neural architectures, web development, and tech startups.';
    setMeta('name', 'description', finalDesc);
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:type', type);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
    if (author) {
      setMeta('name', 'author', author);
    }
    if (publishedTime) {
      setMeta('property', 'article:published_time', publishedTime);
    }

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    // JSON-LD Structured Data
    let scriptTag = document.getElementById('eduai-json-ld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'eduai-json-ld';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, image, canonicalUrl, type, author, publishedTime, jsonLd]);
}
