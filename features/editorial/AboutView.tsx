'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Compass,
  FileCheck2,
  HelpCircle,
  LayoutGrid,
  Mail,
  MessageCircle,
  PenTool,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { SiteHeader } from '@/components/sections/SiteHeader';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { SignatureMotif } from '@/components/ui/SignatureMotif';
import { TeamIllustration } from './TeamIllustrations';
import {
  ABOUT_FAQS_DATA,
  ABOUT_ORIGIN_DATA,
  EDITORIAL_METRICS_DATA,
  INTEGRITY_CHARTER_DATA,
  METHODOLOGY_PILLARS_DATA,
  TEAM_DOSSIERS_DATA,
} from './aboutData';
import styles from './AboutView.module.css';

export function AboutView() {
  const { locale, messages } = useI18n();
  const isAr = locale === 'ar';

  const avatarColorClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return styles.emblemEmerald;
      case 'terracotta':
        return styles.emblemTerracotta;
      case 'teal':
        return styles.emblemTeal;
      case 'olive':
        return styles.emblemOlive;
      case 'clay':
        return styles.emblemClay;
      default:
        return styles.emblemEmerald;
    }
  };

  const memberBorderClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return styles.memberDossierEmerald;
      case 'terracotta':
        return styles.memberDossierTerracotta;
      case 'teal':
        return styles.memberDossierTeal;
      case 'olive':
        return styles.memberDossierOlive;
      case 'clay':
        return styles.memberDossierClay;
      default:
        return styles.memberDossierEmerald;
    }
  };

  const renderMemberIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass size={15} aria-hidden="true" />;
      case 'ScanSearch':
        return <ScanSearch size={15} aria-hidden="true" />;
      case 'PenTool':
        return <PenTool size={15} aria-hidden="true" />;
      case 'ShieldCheck':
        return <ShieldCheck size={15} aria-hidden="true" />;
      case 'LayoutGrid':
        return <LayoutGrid size={15} aria-hidden="true" />;
      default:
        return <BadgeCheck size={15} aria-hidden="true" />;
    }
  };

  return (
    <div className={styles.pageShell}>
      <SiteHeader />

      <main id="main-content" className={`siteContainer ${styles.main}`}>
        {/* ==================================================================
            1. Master Dossier Header & Preamble
            ================================================================== */}
        <header className={`${styles.dossierHeader} revealUp`}>
          <div className={styles.archivalTagStrip}>
            <SignatureMotif
              index="01"
              label={isAr ? 'عن المنصة ورسالتها' : 'About AQURIVO & Mission'}
            />
            <span className={styles.archivalPill}>
              <span className={styles.pulseDot} aria-hidden="true" />
              {isAr
                ? 'الوثيقة التحريرية المستقلة المعتمدة'
                : 'Certified Independent Editorial Dossier'}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            {isAr
              ? 'منصة AQURIVO — درع المتسوق المستقل ومنهجية فحص الصفقات العالمية'
              : 'AQURIVO — Independent Shopper Shield & Global Deal Vetting Methodology'}
          </h1>

          <p className={styles.heroSubtitle}>
            {isAr
              ? 'نحن منصة فحص ومقارنة مستقلة تعمل يومياً على استبعاد العروض الرديئة واختيار أفضل الصفقات الحقيقية من المتاجر العالمية الكبرى، ونوجهك مباشرة للشراء بأمان تام وبدون أي تكلفة إضافية.'
              : 'An independent curation and comparison platform rigorously auditing global marketplaces daily to eliminate substandard deals, routing shoppers directly to verified stores with zero markups.'}
          </p>
        </header>

        {/* ==================================================================
            2. The Origin Story Section (Detailed Narrative)
            ================================================================== */}
        <section
          className={styles.originSection}
          aria-labelledby="origin-story-heading"
        >
          <div className={styles.originHeader}>
            <h2 id="origin-story-heading" className={styles.sectionTitle}>
              {isAr ? ABOUT_ORIGIN_DATA.headingAr : ABOUT_ORIGIN_DATA.headingEn}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAr ? ABOUT_ORIGIN_DATA.subtitleAr : ABOUT_ORIGIN_DATA.subtitleEn}
            </p>
          </div>

          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeProse}>
              {(isAr
                ? ABOUT_ORIGIN_DATA.paragraphsAr
                : ABOUT_ORIGIN_DATA.paragraphsEn
              ).map((paragraph, idx) => (
                <p key={idx} className={styles.narrativeParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <aside className={styles.originCalloutBox}>
              <span className={styles.calloutTag}>
                {isAr ? 'مبدأ التأسيس الراسخ' : 'Founding Pillar'}
              </span>
              <p className={styles.calloutText}>
                {isAr
                  ? '«أنشأنا AQURIVO لأن البحث عن منتج ذي جودة حقيقية بسعر عادل أصبح يأخذ وقتاً طويلاً وسط فوضى الإعلانات. مهمتنا هي توفير هذا الوقت عليك وحماية قرارك الشرائي.»'
                  : '“We created AQURIVO because finding an authentic, durable product at a fair price has become exhausting amidst endless marketing noise. Our mission is to protect your time and your hard-earned money.”'}
              </p>
              <div className={styles.calloutMeta}>
                <BadgeCheck size={16} aria-hidden="true" />
                <span>
                  {isAr
                    ? 'سفيان العرايش — إدارة المشروع والاستراتيجية'
                    : 'Soufiane Laraich — Project Management & Strategy'}
                </span>
              </div>
            </aside>
          </div>
        </section>

        {/* ==================================================================
            3. Operational Trust Metrics (Real Numbers)
            ================================================================== */}
        <section
          className={styles.metricsSection}
          aria-label={isAr ? 'إحصائيات الجهد الميداني' : 'Operational Metrics'}
        >
          <div className={styles.metricsGrid}>
            {EDITORIAL_METRICS_DATA.map((metric, idx) => (
              <div key={idx} className={styles.metricBlock}>
                <span className={styles.metricValue}>{metric.value}</span>
                <p className={styles.metricLabel}>
                  {isAr ? metric.labelAr : metric.labelEn}
                </p>
                <p className={styles.metricCaption}>
                  {isAr ? metric.captionAr : metric.captionEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            4. Methodology Pipeline (The 4 Stages)
            ================================================================== */}
        <section
          className={styles.methodologySection}
          aria-labelledby="methodology-heading"
        >
          <SignatureMotif
            index="02"
            label={isAr ? 'منهجية الفحص والتدقيق' : 'Our 4-Stage Vetting Protocol'}
          />

          <div className={styles.teamHeaderArea}>
            <h2 id="methodology-heading" className={styles.sectionTitle}>
              {isAr
                ? 'كيف نختار وندقق المنتجات قبل نشرها؟'
                : 'How We Audit & Screen Products Before Publication'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAr
                ? 'لا نعتمد على حملات الترويج المضللة أو التقييمات السطحية. كل منتج يمر عبر 4 مراحل تدقيق بشرية صارمة لضمان جدارته بثقتك.'
                : 'We never rely on marketing bots or superficial scores. Every item undergoes a strict 4-stage manual inspection before being recommended.'}
            </p>
          </div>

          <div className={styles.pipelineList}>
            {METHODOLOGY_PILLARS_DATA.map((pillar) => (
              <article key={pillar.step} className={styles.pipelineStage}>
                <div className={styles.stageNumberBadge} aria-hidden="true">
                  {pillar.step}
                </div>

                <div className={styles.stageContent}>
                  <div className={styles.stageTitleRow}>
                    <h3 className={styles.stageTitle}>
                      {isAr ? pillar.titleAr : pillar.titleEn}
                    </h3>
                    <span className={styles.stageSubtitle}>
                      {isAr ? pillar.subtitleAr : pillar.subtitleEn}
                    </span>
                  </div>

                  <p className={styles.stageDesc}>
                    {isAr ? pillar.descAr : pillar.descEn}
                  </p>

                  <div className={styles.stageTagsRow}>
                    {(isAr ? pillar.tagsAr : pillar.tagsEn).map((tag, tIdx) => (
                      <span key={tIdx} className={styles.stageTag}>
                        <CheckCircle2
                          size={12}
                          style={{
                            marginInlineEnd: '4px',
                            color: 'var(--color-accent-primary)',
                          }}
                          aria-hidden="true"
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ==================================================================
            5. Editorial Integrity & Neutrality Charter
            ================================================================== */}
        <section
          className={styles.charterSection}
          aria-labelledby="charter-heading"
        >
          <SignatureMotif
            index="03"
            label={isAr ? 'ميثاق النزاهة المعلن' : 'Editorial Integrity Charter'}
          />

          <div className={styles.teamHeaderArea}>
            <h2 id="charter-heading" className={styles.sectionTitle}>
              {isAr
                ? 'ميثاق النزاهة والحيادية التحريرية في AQURIVO'
                : 'AQURIVO Editorial Integrity & Independence Charter'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAr
                ? 'تعهدات صريحة ومعلنة نلتزم بها أمام كل متسوق يزور منصتنا لضمان الشفافية المطلقة.'
                : 'Clear, binding pledges we uphold to every shopper who trusts our recommendations.'}
            </p>
          </div>

          <div className={styles.charterGrid}>
            {INTEGRITY_CHARTER_DATA.map((item) => (
              <div key={item.number} className={styles.charterItem}>
                <span className={styles.charterNumberTag}>
                  {item.number} / 04
                </span>
                <h3 className={styles.charterTitle}>
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p className={styles.charterPrinciple}>
                  {isAr ? item.principleAr : item.principleEn}
                </p>
                <p className={styles.charterGuarantee}>
                  {isAr ? item.guaranteeAr : item.guaranteeEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            6. The Core Fix: Expanded Professional Team Dossiers
            ================================================================== */}
        <section className={styles.teamSection} aria-labelledby="team-dossiers-heading">
          <SignatureMotif
            index="04"
            label={isAr ? 'فريق العمل والمسؤوليات' : 'Editorial & Operations Team'}
          />

          <div className={styles.teamHeaderArea}>
            <h2 id="team-dossiers-heading" className={styles.sectionTitle}>
              {isAr
                ? 'فريق العمل — الخبرات والمسؤوليات الميدانية'
                : 'The Team — Expertise & Direct Responsibilities'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAr
                ? 'تعرف على الفريق المستقل المسؤول عن البحث عن المنتجات، وإعداد أدلة الشراء، وتدقيق المعلومات لحماية قرارك الشرائي.'
                : 'Meet the independent team behind product research, buying guides, fact-checking, and shopper advocacy at AQURIVO.'}
            </p>
          </div>

          <div className={styles.teamDossierList}>
            {TEAM_DOSSIERS_DATA.map((member) => {
              const displayName = isAr ? member.nameAr : member.nameEn;
              const displayRole = isAr ? member.roleAr : member.roleEn;
              const displayBadge = isAr ? member.badgeAr : member.badgeEn;
              const displayDept = isAr ? member.departmentAr : member.departmentEn;
              const displayScope = isAr ? member.scopeAr : member.scopeEn;
              const displayInitial = isAr ? member.initialAr : member.initialEn;

              return (
                <article
                  key={member.id}
                  className={`${styles.memberDossier} ${memberBorderClass(
                    member.accentColor
                  )}`}
                >
                  {/* Institutional Metadata Tag Strip */}
                  <div className={styles.memberMetaStrip}>
                    <div className={styles.memberMetaLeft}>
                      <span className={styles.memberCodePill}>
                        {member.memberCode}
                      </span>
                      <span className={styles.memberDeptBadge}>
                        {renderMemberIcon(member.iconName)}
                        <span>{displayDept}</span>
                      </span>
                    </div>

                    <div className={styles.memberStatusBadge}>
                      <span className={styles.statusLiveDot} aria-hidden="true" />
                      <span>{isAr ? 'عضو معتمد ونشط' : 'Verified Active Member'}</span>
                    </div>
                  </div>

                  {/* Primary Identity Row */}
                  <div className={styles.memberIdentityRow}>
                    <div
                      className={`${styles.memberAvatarMedallion} ${avatarColorClass(
                        member.accentColor
                      )}`}
                      aria-hidden="true"
                    >
                      <span className={styles.avatarInitial}>{displayInitial}</span>
                      <span className={styles.avatarIconBadge}>
                        {renderMemberIcon(member.iconName)}
                      </span>
                    </div>

                    <div className={styles.memberNameBlock}>
                      <h3 className={styles.memberName}>{displayName}</h3>
                      <p className={styles.memberRole}>{displayRole}</p>
                      <span className={styles.memberDeptSubtitle}>{displayBadge}</span>
                    </div>
                  </div>

                  {/* Core Mission Quote Box */}
                  <div className={styles.missionCard}>
                    <span className={styles.missionLabel}>
                      <ShieldCheck size={13} aria-hidden="true" />
                      {isAr ? 'المهمة الأساسية والدور التحريري' : 'Core Role & Responsibilities'}
                    </span>
                    <p className={styles.missionText}>
                      &ldquo;{displayScope}&rdquo;
                    </p>
                  </div>

                  {/* Dedicated Visual Illustration Canvas */}
                  <div className={styles.illustrationSection}>
                    <div className={styles.illustrationMetaBar}>
                      <span className={styles.illustrationTitle}>
                        {isAr ? member.illustrationTitleAr : member.illustrationTitleEn}
                      </span>
                      <span className={styles.illustrationCaption}>
                        {isAr ? member.illustrationCaptionAr : member.illustrationCaptionEn}
                      </span>
                    </div>
                    <TeamIllustration
                      type={member.illustrationType}
                      accentColor={member.accentColor}
                      isAr={isAr}
                    />
                  </div>

                  {/* 3-Step Actionable Workflow Protocol */}
                  <div className={styles.workflowSection}>
                    <div className={styles.workflowSectionHeading}>
                      <Sparkles size={14} aria-hidden="true" />
                      <span>
                        {isAr
                          ? 'خطوات العمل الميداني والتدقيق اليومي'
                          : 'Daily Execution & Audit Protocol'}
                      </span>
                    </div>

                    <div className={styles.workflowGrid}>
                      {member.workflowSteps.map((step) => (
                        <div key={step.index} className={styles.workflowCard}>
                          <div className={styles.workflowCardHeader}>
                            <span className={styles.workflowStepNumber}>
                              {step.index}
                            </span>
                            <span className={styles.workflowTag}>
                              {isAr ? step.tagAr : step.tagEn}
                            </span>
                          </div>
                          <h4 className={styles.workflowTitle}>
                            {isAr ? step.titleAr : step.titleEn}
                          </h4>
                          <p className={styles.workflowDesc}>
                            {isAr ? step.descAr : step.descEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Motto / Trust Anchor Footer */}
                  <div className={styles.mottoFooter}>
                    <span className={styles.mottoLabel}>
                      {isAr ? 'مبدأ الالتزام التحريري' : 'Core Commitment'}:
                    </span>
                    <p className={styles.mottoText}>
                      &ldquo;{isAr ? member.signatureMottoAr : member.signatureMottoEn}&rdquo;
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            7. Editorial Shopper FAQs
            ================================================================== */}
        <section className={styles.faqSection} aria-labelledby="faq-heading">
          <SignatureMotif
            index="05"
            label={isAr ? 'أسئلة شائعة' : 'Editorial FAQs'}
          />

          <div className={styles.teamHeaderArea}>
            <h2 id="faq-heading" className={styles.sectionTitle}>
              {isAr
                ? 'إجابات واضحة لأسئلة المتسوق الجوهرية'
                : 'Clear Human Answers to Essential Shopper Inquiries'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isAr
                ? 'كل ما تود معرفته عن استقلاليتنا، حماية بياناتك، وأمان توجيه الروابط.'
                : 'Everything you need to know regarding our independence, data safety, and secure routing.'}
            </p>
          </div>

          <div className={styles.faqList}>
            {ABOUT_FAQS_DATA.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>
                  <HelpCircle
                    size={18}
                    className={styles.faqQuestionIcon}
                    aria-hidden="true"
                  />
                  <span>{isAr ? faq.questionAr : faq.questionEn}</span>
                </h3>
                <p className={styles.faqAnswer}>
                  {isAr ? faq.answerAr : faq.answerEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            8. Direct Open Support & Contact Channels
            ================================================================== */}
        <section
          className={styles.contactStrip}
          aria-labelledby="contact-heading"
        >
          <div className={styles.contactIntro}>
            <SignatureMotif
              index="06"
              label={isAr ? 'تواصل مباشر' : 'Direct Line'}
            />
            <h2 id="contact-heading" className={styles.contactTitle}>
              {isAr
                ? 'هل لديك استفسار أو ملاحظة حول منتج رشحناه؟'
                : 'Have Feedback or Questions Regarding a Recommended Deal?'}
            </h2>
            <p className={styles.contactDescription}>
              {isAr
                ? 'أبوابنا مفتوحة دائماً لتجارب المشترين. إذا اكتشفت عيباً في منتج رشحناه، أو واجهت مشكلة مع رابط متجر شريك، يمكنك مراسلة فريق التحرير أو المؤسس مباشرة وسنرد عليك في غضون 24 ساعة.'
                : 'Our channels are permanently open to verified buyer feedback. If you identify a flaw in a recommended deal or encounter an issue, contact our curation team or founder directly.'}
            </p>
          </div>

          <div className={styles.contactChannelsRow}>
            <a
              href="https://wa.me/212684063908"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelPillAccent}
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>
                {isAr
                  ? 'واتساب الرسمي: +212 684 063908'
                  : 'Official WhatsApp: +212 684 063908'}
              </span>
            </a>

            <a
              href="mailto:contact@aqurivo.store"
              className={styles.channelPill}
            >
              <Mail size={16} aria-hidden="true" />
              <span>
                {isAr
                  ? 'التواصل العام: contact@aqurivo.store'
                  : 'General: contact@aqurivo.store'}
              </span>
            </a>

            <a
              href="mailto:support@aqurivo.store"
              className={styles.channelPill}
            >
              <Mail size={16} aria-hidden="true" />
              <span>
                {isAr
                  ? 'خدمة العملاء: support@aqurivo.store'
                  : 'Customer Support: support@aqurivo.store'}
              </span>
            </a>
          </div>

          <div className={styles.navigationActionsRow}>
            <Link
              href={`/${locale}/security`}
              className={styles.actionSecondaryLink}
            >
              <FileCheck2 size={14} aria-hidden="true" />
              <span>
                {isAr
                  ? 'مراجعة وثيقة اعتماد الأمان وفحص الروابط'
                  : 'Inspect Official Trust & Safe Link Dossier'}
              </span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>

            <Link
              href={`/${locale}/affiliate-disclosure`}
              className={styles.actionSecondaryLink}
            >
              <Scale size={14} aria-hidden="true" />
              <span>
                {isAr
                  ? 'الاطلاع على وثيقة إفصاح العمولات والشفافية'
                  : 'Read Full Affiliate Disclosure & Commission Transparency'}
              </span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
