'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/i18n/context';
import { getLocalizedText } from '@/i18n/utils';
import styles from './TicketCards.module.css';

interface PublicTicket {
  id: string;
  slug: string;
  name: string | Record<string, string>;
  duration: string | Record<string, string>;
  priceAdult: number;
  thumbnail?: string;
  longDescription?: string | Record<string, string>;
  averageRating?: string;
  reviewCount?: number;
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export function TicketCards({ tickets = [] }: { tickets: PublicTicket[] }) {
  const { t, locale } = useI18n();

  return (
    <section className={styles.section} aria-label="Jegyek">
      <div className={styles.grid}>
        {tickets.map(({ slug, name, duration, priceAdult, thumbnail, longDescription, averageRating, reviewCount }) => {
          const transDesc = t(`${slug}.description`);
          const hasTrans = transDesc && transDesc !== `${slug}.description`;
          const fallbackDesc = longDescription ? stripHtml(getLocalizedText(longDescription, locale)).substring(0, 100) + '...' : transDesc;

          return (
            <article key={slug} id={slug} className={styles.card}>
              <div className={styles.imageWrap}>
                {thumbnail ? (
                  <Image src={thumbnail} alt={getLocalizedText(name, locale)} fill className={styles.cardImage} />
                ) : (
                  <div className={styles.placeholder} data-slug={slug} />
                )}
              </div>
              <div className={styles.content}>
                <h2 className={styles.title}>{getLocalizedText(name, locale)}</h2>
                {averageRating && Number(averageRating) > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                    <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★</span>
                    <strong style={{ color: '#0f172a' }}>{averageRating}/5</strong>
                    <span>({reviewCount} {t('reviews.count') || 'értékelés'})</span>
                  </div>
                )}
                <p className={styles.desc}>{hasTrans ? transDesc : fallbackDesc}</p>
                <p className={styles.duration}>{t('tickets.duration')}: {getLocalizedText(duration, locale)}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>
                    {t('tickets.from')} €{Number(priceAdult).toFixed(2)}
                  </span>
                  <Link href={`/${slug}`} className={styles.cta} aria-label={`${t('tickets.buy')} - ${getLocalizedText(name, locale)}`}>
                    {t('tickets.buy')}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
