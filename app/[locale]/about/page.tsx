import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutView } from '@/features/editorial/AboutView';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aqurivo.store';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') {
    return {
      metadataBase: new URL(SITE_URL),
      title: '404 | AQURIVO',
      robots: 'noindex, nofollow',
    };
  }

  const isEn = locale === 'en';
  const canonicalUrl = `${SITE_URL}/${isEn ? 'en' : 'ar'}/about`;
  const title = isEn
    ? 'About AQURIVO — Independent Deal Vetting, Origin Story & Team Dossiers | AQURIVO'
    : 'من نحن ومنهجية الفحص وسجل فريق العمل المستقل — AQURIVO';
  const description = isEn
    ? 'Discover AQURIVO’s independent product curation protocol: our 4-stage manual audit, flaws-first integrity charter, and verified team dossiers protecting shoppers.'
    : 'تعرف على منصة AQURIVO ومنهجية الفحص اليدوي في 4 مراحل، وميثاق النزاهة والحيادية التحريرية، وسجل ملفات فريق العمل والخبراء لحماية المتسوق.';

  const ogImageUrl = `${SITE_URL}/images/hero-desktop.jpg`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      thumbnail: ogImageUrl,
      'og:image:secure_url': ogImageUrl,
      'og:image:type': 'image/jpeg',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${SITE_URL}/ar/about`,
        en: `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/en/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'AQURIVO',
      locale: isEn ? 'en_US' : 'ar_SA',
      alternateLocale: isEn ? ['ar_SA'] : ['en_US'],
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 675,
          type: 'image/jpeg',
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@aqurivo',
      creator: '@aqurivo',
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
    },
  };
}

export default async function LocalizedAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') {
    notFound();
  }

  const isAr = locale === 'ar';

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: isAr
          ? 'من نحن وسجل فريق العمل ومنهجية الفحص — AQURIVO'
          : 'About AQURIVO, Team Dossiers & Curation Methodology',
        url: `${SITE_URL}/${locale}/about`,
        inLanguage: isAr ? 'ar' : 'en',
        description: isAr
          ? 'AQURIVO منصة تحريرية مستقلة لاختيار وفحص صفقات التجارة الإلكترونية بميثاق نزاهة معلن وملفات فريق متخصصة.'
          : 'AQURIVO is an independent editorial curation platform auditing e-commerce deals with verified human teams.',
        publisher: {
          '@type': 'Organization',
          name: 'AQURIVO',
          url: SITE_URL,
          founder: {
            '@type': 'Person',
            name: isAr ? 'سفيان العرايش' : 'Soufiane Laraich',
            jobTitle: isAr
              ? 'إدارة المشروع والاستراتيجية'
              : 'Project Management & Strategy',
          },
          member: [
            {
              '@type': 'Person',
              name: isAr ? 'سفيان العرايش' : 'Soufiane Laraich',
              jobTitle: isAr
                ? 'إدارة المشروع والاستراتيجية'
                : 'Project Management & Strategy',
            },
            {
              '@type': 'Person',
              name: isAr ? 'سعيد طلحة' : 'Said Talha',
              jobTitle: isAr ? 'البحث عن المنتجات' : 'Product Research',
            },
            {
              '@type': 'Person',
              name: 'Youssef Bouchoi',
              jobTitle: isAr ? 'تحرير المحتوى' : 'Content Editorial',
            },
            {
              '@type': 'Person',
              name: isAr ? 'إلياس حيطان' : 'Ilyas Hitane',
              jobTitle: isAr
                ? 'مراجعة المعلومات'
                : 'Information Fact-Checking',
            },
            {
              '@type': 'Person',
              name: isAr ? 'فراح العرايش' : 'Farah Laraich',
              jobTitle: isAr
                ? 'جودة المحتوى وتجربة المستخدم'
                : 'Content Quality & User Experience',
            },
          ],
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isAr ? 'الرئيسية' : 'Home',
            item: `${SITE_URL}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? 'من نحن' : 'About Us',
            item: `${SITE_URL}/${locale}/about`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageJsonLd),
        }}
      />
      <AboutView />
    </>
  );
}
