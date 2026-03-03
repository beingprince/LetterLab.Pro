import React from 'react';
import FooterPageLayout from '../../../../components/footer/footer-pages/layout/FooterPageLayout';
import FeatureSection from '../../../../components/footer/footer-pages/FeatureSection';
import content from '../../../../content/footer-pages/product.features.json';
import HeroFeatures from './sections/HeroFeatures';

export default function FeaturesPage() {
  return (
    <FooterPageLayout
      slug={content.slug}
      title={content.title}
      lead={content.lead}
      breadcrumbs
      customHero={<HeroFeatures title={content.title} lead={content.lead} />}
    >
      {content.sections.map((section, index) => (
        <FeatureSection
          key={section.id}
          index={index}
          label={section.label}
          title={section.title}
          paragraph={section.paragraph}
          bullets={section.bullets}
          cta={section.cta}
          previewType={section.previewType}
          ctaHref="#"
        />
      ))}
    </FooterPageLayout>
  );
}
