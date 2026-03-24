'use client';

import { useEffect, useState } from 'react';
import { Nav } from '@/components/Nav';
import { useI18n } from '@/i18n/context';
import styles from '../page.module.css';

export default function CookiePolicyPage() {
    const { locale, t } = useI18n();
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`/api/cookie-policy?lang=${locale}`)
            .then(res => res.json())
            .then(data => {
                if (data.text) setContent(data.text);
            })
            .catch(err => console.error(err));
    }, [locale]);

    return (
        <main style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Nav />
            <section className={styles.legalWrapper}>
                <div className={styles.legalCard}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '8px',
                        background: 'linear-gradient(90deg, #1f2937, #1e3a8a)'
                    }} />

                    <h1 style={{
                        marginBottom: '1rem',
                        fontSize: '3rem',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        color: '#111'
                    }}>
                        {t('footer.cookiePolicy') || 'Cookie Policy'}
                    </h1>

                    <div className="cookie-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ whiteSpace: 'normal', lineHeight: 1.8, color: '#4b5563', fontSize: '1.1rem' }}
                    />

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .cookie-content p {
                            margin-bottom: 1.5rem;
                            min-height: 1rem;
                        }
                        .cookie-content h2 {
                            margin-top: 3rem;
                            margin-bottom: 1.5rem;
                            font-size: 1.8rem;
                            color: #111;
                            border-bottom: 2px solid #f3f4f6;
                            padding-bottom: 0.5rem;
                        }
                        .cookie-content h3 {
                            margin-top: 2rem;
                            margin-bottom: 1rem;
                            font-size: 1.4rem;
                            color: #374151;
                        }
                        .cookie-content ul {
                            margin-bottom: 2rem;
                            padding-left: 1.5rem;
                            list-style-type: none;
                        }
                        .cookie-content ul li {
                            position: relative;
                            margin-bottom: 0.5rem;
                            padding-left: 1.5rem;
                        }
                        .cookie-content ul li::before {
                            content: "•";
                            color: #1e3a8a;
                            font-weight: bold;
                            position: absolute;
                            left: 0;
                            font-size: 1.2rem;
                        }
                        .cookie-content strong {
                            color: #1f2937;
                            font-weight: 600;
                        }
                    `}} />
                </div>
            </section>
        </main>
    );
}
