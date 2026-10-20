import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { Product } from '../types';
import {
  normalizeSearchText,
  stripArabicPrefixes,
  getInflectionVariants,
  toPhoneticSkeleton,
  scoreProductMatch,
  deduplicateProducts,
  applyCategoryAndStoreDiversity,
  computeProductDataQualityScore,
  getVerifiedProductRating,
  computeUnifiedRankingScore,
  searchAndRankProducts,
  isNewVisitor,
  COMPLEMENTARY_CATEGORY_MATRIX,
} from '../lib/productSearch';
import {
  computeProductItemAffinity,
  getSmartRecommendations,
} from '../server/services/recommendation.service';

const createMockProduct = (overrides: Partial<Product> = {}): Product => {
  const id = overrides.id || 'prod-1';
  const cleanOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([_, v]) => v !== undefined)
  );
  return {
    id,
    slug: id,
    title: { ar: 'منتج تجريبي ممتاز', en: 'Premium Test Product' },
    name: { ar: 'منتج تجريبي ممتاز', en: 'Premium Test Product' },
    shortSummary: { ar: 'ملخص قصير تجريبي', en: 'Short test summary' },
    whyWePickedIt: {
      ar: 'اخترنا هذا المنتج لكفاءته العالية وتصميمه المتقن وسعره العادل.',
      en: 'Selected for superior performance, balanced ergonomics and value.',
    },
    whatToConsider: {
      ar: 'يرجى مراعاة أبعاد الجهاز والتوافق مع منافذ مكتبك.',
      en: 'Check desktop dimensions and port compatibility.',
    },
    description: { ar: 'وصف تجريبي', en: 'Test description' },
    priceAmount: 100,
    priceCurrency: 'USD',
    priceDisplayPolicy: 'show_with_timestamp',
    priceUpdatedAt: new Date().toISOString(),
    images: [
      { url: 'https://images.example.com/p1.jpg', alt: { ar: 'صورة 1', en: 'Test Photo 1' }, width: 800, height: 800 },
      { url: 'https://images.example.com/p2.jpg', alt: { ar: 'صورة 2', en: 'Test Photo 2' }, width: 800, height: 800 },
      { url: 'https://images.example.com/p3.jpg', alt: { ar: 'صورة 3', en: 'Test Photo 3' }, width: 800, height: 800 },
    ],
    affiliateUrl: 'https://example.com/buy',
    sourceId: 'src-1',
    sourceSlug: 'amazon',
    sourceName: { ar: 'أمازون', en: 'Amazon' },
    sourceDisclosure: { ar: 'إفصاح الشريك', en: 'Affiliate disclosure' },
    categoryId: 'cat-1',
    categorySlug: 'electronics',
    categoryName: { ar: 'إلكترونيات', en: 'Electronics' },
    tags: ['test'],
    isFeatured: true,
    status: 'published',
    clicksCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specs: [
      { label: 'القدرة', value: '100W' },
      { label: 'الوزن', value: '250g' },
      { label: 'المنافذ', value: '3x USB-C' },
    ],
    pros: ['ميزة أولى موثقة', 'ميزة ثانية موثقة'],
    cons: ['نقطة انتباه أولى موثقة'],
    comparisonDna: {
      keySpecs: {
        ar: ['قدرة 100 واط', 'منفذ USB-C'],
        en: ['100W Power', 'USB-C Port'],
      },
    },
    ...cleanOverrides,
  };
};

describe('Phase 4: Arabic and English Search, Normalization & Stemming', () => {
  it('normalizes Arabic text: diacritics, alef forms, hamza, and ta marbuta', () => {
    // Diacritics
    assert.strictEqual(normalizeSearchText('سَمَّاعَاتٌ'), 'سماعات');
    // Alef variants
    assert.strictEqual(normalizeSearchText('أفضل إلكترونيات آمنة'), 'افضل الكترونيات امنه');
    // Tatweel
    assert.strictEqual(normalizeSearchText('شـــــاحـن'), 'شاحن');
    // Hamza on waw and ya
    assert.strictEqual(normalizeSearchText('مؤثر بيئة رائع'), 'موثر بييه رايع');
  });

  it('strips Arabic prefixes accurately (الـ, بالـ, كالـ, فالـ, ولـ, للـ, وللـ)', () => {
    assert.ok(stripArabicPrefixes('السماعات').includes('سماعات'));
    assert.ok(stripArabicPrefixes('بالشاحن').includes('شاحن'));
    assert.ok(stripArabicPrefixes('كالمصباح').includes('مصباح'));
    assert.ok(stripArabicPrefixes('وللحاسوب').includes('حاسوب'));
    assert.ok(stripArabicPrefixes('فالماوس').includes('ماوس'));
  });

  it('generates inflection variants for common Arabic plurals and forms', () => {
    const variants = getInflectionVariants('سماعات');
    assert.ok(variants.includes('سماعه'), 'Plural سماعات should include singular سماعه');

    const chargerVariants = getInflectionVariants('شواحن');
    assert.ok(chargerVariants.includes('شاحن'), 'Broken plural شواحن should include singular شاحن');

    const reverseVariants = getInflectionVariants('شاحن');
    assert.ok(reverseVariants.includes('شواحن'), 'Singular شاحن should expand to plural شواحن');

    const lampVariants = getInflectionVariants('مصابيح');
    assert.ok(lampVariants.includes('مصباح'), 'Broken plural مصابيح should include singular مصباح');
  });

  it('matches bilingual synonyms and concept groups', () => {
    const mugProduct = createMockProduct({
      id: 'contigo-mug-1',
      title: { ar: 'كوب حراري ستانلس ستيل للمكتب والسفر', en: 'Contigo Byron Vacuum Insulated Travel Mug' },
      tags: ['mug', 'travel', 'thermos'],
    });

    // Query in Arabic: "ترمس" (thermos) or "مج" or "كوب حراري"
    const scoreArabic1 = scoreProductMatch(mugProduct, 'ترمس حراري');
    assert.ok(scoreArabic1 > 0, 'Should match ترمس with travel mug concept');

    const scoreArabic2 = scoreProductMatch(mugProduct, 'مج حراري');
    assert.ok(scoreArabic2 > 0, 'Should match مج with travel mug concept');

    // Query in English
    const scoreEng = scoreProductMatch(mugProduct, 'travel tumbler');
    assert.ok(scoreEng > 0, 'Should match travel tumbler');
  });

  it('handles typos and spelling errors through phonetic skeleton matching', () => {
    const headphoneProduct = createMockProduct({
      id: 'anker-soundcore-1',
      title: { ar: 'سماعات انكر ساوند كور اللاسلكية', en: 'Anker Soundcore Wireless Headphones' },
      categorySlug: 'audio',
    });

    // Typo with repeated letters and slightly misspelled: "سسماعةة"
    const scoreTypo = scoreProductMatch(headphoneProduct, 'سسماعةة');
    assert.ok(scoreTypo > 0, 'Phonetic matching should match duplicate-letter typo');

    // English typo: "headfone" instead of "headphone"
    assert.strictEqual(toPhoneticSkeleton('headfone'), toPhoneticSkeleton('headphone'));
    const scoreEngTypo = scoreProductMatch(headphoneProduct, 'headfone');
    assert.ok(scoreEngTypo > 0, 'Phonetic skeleton should match headfone to headphone');
  });
});

describe('Phase 4: Unified Multi-Objective Ranking Formulation', () => {
  it('combines relevance, category, price, engagement, and data quality into composite score', () => {
    const product = createMockProduct({
      priceAmount: 89,
      clicksCount: 120,
      impressionsCount: 2000,
      affiliateClicksCount: 15,
      confirmedConversionsCount: 3,
    });

    const ranking = computeUnifiedRankingScore(product, {
      rawQuery: 'منتج تجريبي',
      targetCategorySlug: 'electronics',
      preferredPriceTarget: 85,
    });

    assert.ok(ranking.relevance > 0, 'Relevance should be positive');
    assert.strictEqual(ranking.categoryAffinity, 100, 'Exact category should yield 100');
    assert.ok(ranking.priceAlignment > 70, 'Price within 10% should have high alignment');
    assert.ok(ranking.engagement > 0, 'Engagement should reflect real CTR & conversions');
    assert.ok(ranking.dataQuality > 50, 'Data quality should reflect specs, pros, cons');
    assert.ok(ranking.compositeScore > 0, 'Composite score should be positive');
  });

  it('does not invent fake star ratings or reviews when absent', () => {
    const productWithoutRating = createMockProduct({
      rating: undefined,
      stars: undefined,
      reviewCount: 0,
    });

    // Must return null, not an arbitrary 4.3 or 4.5
    const verifiedRating = getVerifiedProductRating(productWithoutRating);
    assert.strictEqual(verifiedRating, null, 'Unverified rating must return null');

    // Data quality score reflects actual editorial completeness
    const dataQuality = computeProductDataQualityScore(productWithoutRating);
    assert.ok(dataQuality >= 40 && dataQuality <= 100, 'Quality score must be based on documented attributes');
  });

  it('verifies ratings only when documented and backed by authentic reviews', () => {
    const productWithRating = createMockProduct({
      rating: 4.6,
      reviewCount: 250,
    });

    const verified = getVerifiedProductRating(productWithRating);
    assert.strictEqual(verified, 4.6, 'Authentic verified rating should be extracted');
  });

  it('rewards complementary categories in the ecosystem graph', () => {
    const pcProduct = createMockProduct({
      id: 'pc-1',
      categorySlug: 'computers',
    });
    const keyboardProduct = createMockProduct({
      id: 'kb-1',
      categorySlug: 'keyboards-mice',
      priceAmount: 45,
    });

    // Check complementary matrix definition
    assert.ok(
      COMPLEMENTARY_CATEGORY_MATRIX['computers'].includes('keyboards-mice'),
      'Computers should complement keyboards-mice'
    );

    const affinity = computeProductItemAffinity(pcProduct, keyboardProduct);
    assert.ok(affinity.score >= 40, 'Cross-category complementary score should be strong');
    assert.ok(affinity.isComplement, 'Should be flagged as complementary companion');
  });
});

describe('Phase 4: Deduplication and Diversity', () => {
  it('deduplicates products by id, slug, and canonical title', () => {
    const products: Product[] = [
      createMockProduct({ id: 'p1', slug: 'anker-charger', title: { ar: 'شاحن انكر', en: 'Anker Charger' } }),
      createMockProduct({ id: 'p1', slug: 'anker-charger-dup', title: { ar: 'شاحن انكر آخر', en: 'Anker Charger 2' } }), // Duplicate ID
      createMockProduct({ id: 'p2', slug: 'anker-charger', title: { ar: 'شاحن انكر ثالث', en: 'Anker Charger 3' } }), // Duplicate slug
      createMockProduct({ id: 'p3', slug: 'anker-charger-clean', title: { ar: 'شاحن انكر', en: 'Anker Charger' } }), // Duplicate title
      createMockProduct({ id: 'p4', slug: 'unique-headphones', title: { ar: 'سماعات رأس فريدة', en: 'Unique Headphones' } }),
    ];

    const deduped = deduplicateProducts(products);
    assert.strictEqual(deduped.length, 2, 'Should leave only 2 distinct products');
    assert.strictEqual(deduped[0].id, 'p1');
    assert.strictEqual(deduped[1].id, 'p4');
  });

  it('prevents single category or store from monopolizing consecutive positions', () => {
    const products: Product[] = [
      createMockProduct({ id: 'e1', categorySlug: 'electronics', sourceSlug: 'amazon' }),
      createMockProduct({ id: 'e2', categorySlug: 'electronics', sourceSlug: 'amazon' }),
      createMockProduct({ id: 'e3', categorySlug: 'electronics', sourceSlug: 'amazon' }),
      createMockProduct({ id: 'a1', categorySlug: 'audio', sourceSlug: 'noon' }),
      createMockProduct({ id: 'c1', categorySlug: 'computers', sourceSlug: 'aliexpress' }),
    ];

    const diversified = applyCategoryAndStoreDiversity(products, {
      maxConsecutivePerCategory: 2,
      maxConsecutivePerStore: 2,
    });

    assert.strictEqual(diversified.length, products.length);

    // Verify no 3 consecutive electronics
    for (let i = 0; i < diversified.length - 2; i += 1) {
      const triplet = [
        diversified[i].categorySlug,
        diversified[i + 1].categorySlug,
        diversified[i + 2].categorySlug,
      ];
      assert.ok(
        !(triplet[0] === 'electronics' && triplet[1] === 'electronics' && triplet[2] === 'electronics'),
        'Should not have 3 consecutive electronics'
      );
    }
  });

  it('handles cold-start new visitors with editorial data quality ranking', () => {
    const isNew = isNewVisitor({
      queries: [],
      categories: [],
      viewedProductIds: [],
      preferredPriceMin: null,
      preferredPriceMax: null,
      seed: 42,
    });
    assert.strictEqual(isNew, true, 'Clean profile should be recognized as new visitor');

    const products: Product[] = [
      createMockProduct({
        id: 'sparse-1',
        slug: 'sparse-1',
        title: { ar: 'منتج أولي ناقص التوثيق', en: 'Incomplete Sparse Product' },
        name: { ar: 'منتج أولي ناقص التوثيق', en: 'Incomplete Sparse Product' },
        images: [],
        whyWePickedIt: undefined,
        whatToConsider: undefined,
        specs: [],
        pros: [],
        cons: [],
        comparisonDna: undefined,
        priceAmount: 0,
      }),
      createMockProduct({
        id: 'complete-1',
        slug: 'complete-1',
        title: { ar: 'منتج متكامل موثق بالمواصفات', en: 'Complete Verified Product with Specs' },
        name: { ar: 'منتج متكامل موثق بالمواصفات', en: 'Complete Verified Product with Specs' },
        pros: ['ميزة 1', 'ميزة 2'],
        cons: ['نقطة 1'],
        comparisonDna: { keySpecs: { ar: ['مواصفة 1', 'مواصفة 2', 'مواصفة 3'], en: ['Spec 1', 'Spec 2', 'Spec 3'] } },
        priceAmount: 99,
      }),
    ];

    const ranked = searchAndRankProducts(products, '', undefined, { isNewVisitor: true });
    assert.strictEqual(ranked[0].id, 'complete-1', 'Editorial complete product must lead for new visitor');
  });
});
