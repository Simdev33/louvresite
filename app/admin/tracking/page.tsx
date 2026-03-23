'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import styles from '../admin.module.css';

export default function AdminTrackingPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [tracking, setTracking] = useState({
        gtm_id: '',
        ga4_id: '',
        ads_id: '',
        conversion_label: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/admin/tracking')
            .then(res => res.json())
            .then(data => {
                if (data.tracking) {
                    setTracking({
                        gtm_id: data.tracking.gtm_id || '',
                        ga4_id: data.tracking.ga4_id || '',
                        ads_id: data.tracking.ads_id || '',
                        conversion_label: data.tracking.conversion_label || ''
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/tracking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tracking })
            });

            if (res.ok) {
                setMessage('Tracking IDs saved successfully!');
            } else {
                setMessage('Failed to save tracking IDs.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <main className={styles.main}>
            <div className={styles.shell}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarTitle}>Admin</div>
                    <nav className={styles.menu}>
                        <Link href="/admin" className={styles.menuItem}>Dashboard</Link>
                        <Link href="/admin/tickets" className={styles.menuItem}>Manage tickets</Link>
                        <Link href="/admin/orders" className={styles.menuItem}>{t('admin.orders') || 'Orders'}</Link>
                        <Link href="/admin/stripe" className={styles.menuItem}>Stripe API</Link>
                        <Link href="/admin/reviews" className={styles.menuItem}>Reviews</Link>
                        <Link href="/admin/terms" className={styles.menuItem}>{t('admin.terms') || 'Terms'}</Link>
                        <Link href="/admin/about" className={styles.menuItem}>{t('admin.about') || 'About Us'}</Link>
                        <Link href="/admin/privacy" className={styles.menuItem}>{t('admin.privacy') || 'Privacy'}</Link>
                        <Link href="/admin/faq" className={styles.menuItem}>{t('admin.faq') || 'FAQ'}</Link>
                        <Link href="/admin/disclaimer-site" className={styles.menuItem}>{t('admin.disclaimerSite') || 'Disclaimer Site'}</Link>
                        <Link href="/admin/disclaimer" className={styles.menuItem}>{t('admin.disclaimer') || 'Disclaimer'}</Link>
                        <Link href="/admin/company" className={styles.menuItem}>{t('admin.company') || 'Company'}</Link>
                        <Link href="/admin/guide" className={styles.menuItem}>Guide</Link>
                        <Link href="/admin/tracking" className={`${styles.menuItem} ${styles.menuItemActive}`}>Tracking</Link>
                        <button onClick={handleLogout} className={styles.menuItem} style={{ textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', width: '100%', padding: '10px 15px', marginTop: '10px' }}>Logout</button>
                    </nav>
                </aside>

                <section className={styles.content}>
                    <h1 className={styles.title}>Tracking & Analytics</h1>
                    <p style={{ marginBottom: '20px', color: '#64748b' }}>
                        Set up Google Tag Manager, Google Analytics 4, and Google Ads tracking IDs.
                        These scripts will only be injected on the frontend if the user accepts the cookie consent.
                    </p>

                    {loading ? (
                        <p className={styles.loading}>Loading…</p>
                    ) : (
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.field}>
                                <label className={styles.label}>Google Tag Manager ID (e.g., GTM-XXXXXXX)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={tracking.gtm_id}
                                    onChange={e => setTracking({ ...tracking, gtm_id: e.target.value })}
                                    placeholder="GTM-"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Google Analytics 4 ID (e.g., G-XXXXXXXXXX)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={tracking.ga4_id}
                                    onChange={e => setTracking({ ...tracking, ga4_id: e.target.value })}
                                    placeholder="G-"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Google Ads ID (e.g., AW-XXXXXXXXXX)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={tracking.ads_id}
                                    onChange={e => setTracking({ ...tracking, ads_id: e.target.value })}
                                    placeholder="AW-"
                                />
                                <small style={{ display: 'block', marginTop: '5px', color: '#64748b' }}>
                                    Your Google Ads account ID, used for gtag config.
                                </small>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Google Ads Conversion Label (e.g., AbC1DeFgHiJkLmN)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={tracking.conversion_label}
                                    onChange={e => setTracking({ ...tracking, conversion_label: e.target.value })}
                                    placeholder="AbC1DeFgHiJkLmN"
                                />
                                <small style={{ display: 'block', marginTop: '5px', color: '#64748b' }}>
                                    Found in Google Ads → Goals → Conversions → Your action → Tag setup.
                                    Combined with Ads ID to form: AW-XXXXXXXXXX/AbC1DeFgHiJkLmN
                                </small>
                            </div>

                            <div className={styles.actions}>
                                <button type="submit" className={styles.saveBtn} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Tracking IDs'}
                                </button>
                                {message && (
                                    <span style={{ marginLeft: '15px', color: message.includes('success') ? '#10b981' : '#ef4444' }}>
                                        {message}
                                    </span>
                                )}
                            </div>
                        </form>
                    )}

                    <Link href="/" className={styles.back}>{t('nav.home')}</Link>
                </section>
            </div>
        </main>
    );
}
