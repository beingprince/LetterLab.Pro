import React, { useState, useEffect } from 'react';
import { fetchFooterPage } from '../../lib/footer-pages/api';
import FooterPageLayout from '../../components/footer/footer-pages/layout/FooterPageLayout';
import SectionRenderer from '../../components/footer/footer-pages/SectionRenderer';

export default function FooterPage({ slug }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchFooterPage(slug)
      .then((data) => {
        if (!cancelled) setContent(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (error) {
    return (
      <div className="footer-pages" style={{ padding: 48, textAlign: 'center' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="footer-pages" style={{ padding: 48, textAlign: 'center' }}>
        <p>Loading…</p>
      </div>
    );
  }

  const lastUpdated = content.lastUpdated || (content.sections?.find((s) => s.id === 'overview') ? undefined : undefined);
  const legalSlugs = ['legal/privacy-policy', 'legal/terms-of-service'];
  const showLastUpdated = legalSlugs.includes(slug) && content.lastUpdated;

  return (
    <FooterPageLayout
      slug={content.slug}
      title={content.title}
      lead={content.lead}
      lastUpdated={showLastUpdated ? content.lastUpdated : undefined}
    >
      <SectionRenderer sections={content.sections || []} slug={content.slug} />
    </FooterPageLayout>
  );
}
