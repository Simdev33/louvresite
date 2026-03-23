'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Nav } from '@/components/Nav';
import styles from './success.module.css';

import { useState, useEffect, useRef } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [sessionData, setSessionData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const hasSynced = useRef(false);
    const hasTracked = useRef(false);
    const [adsId, setAdsId] = useState<string | null>(null);
    const [conversionLabel, setConversionLabel] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/tracking')
            .then(res => res.json())
            .then(data => {
                if (data.tracking?.ads_id) setAdsId(data.tracking.ads_id);
                if (data.tracking?.conversion_label) setConversionLabel(data.tracking.conversion_label);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }
        fetch(`/api/checkout/session?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.session) {
                    setSessionData(data.session);
                    // Trigger manual sync only once
                    if (!hasSynced.current) {
                        hasSynced.current = true;
                        fetch('/api/checkout/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId })
                        }).catch(console.error);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [sessionId]);

    useEffect(() => {
        if (!sessionData || !adsId || !conversionLabel || hasTracked.current) return;
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'true') return;

        const sendConversion = () => {
            if (typeof window === 'undefined' || !(window as any).gtag) return false;
            hasTracked.current = true;
            const value = (sessionData.amount_total / 100).toFixed(2);
            (window as any).gtag('event', 'conversion', {
                'send_to': `${adsId}/${conversionLabel}`,
                'value': parseFloat(value),
                'currency': sessionData.currency ? sessionData.currency.toUpperCase() : 'EUR',
                'transaction_id': sessionId
            });
            return true;
        };

        if (!sendConversion()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (sendConversion() || attempts >= 20) {
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [sessionData, adsId, conversionLabel, sessionId]);

    const meta = sessionData?.metadata || {};

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrap}>
                    ✓
                </div>
                <h1 className={styles.title}>Thank You For Your Order!</h1>
                <p className={styles.text}>
                    Your payment was processed successfully. Below are the details of your booking.
                </p>

                {loading ? (
                    <p className={styles.loading}>Loading order details...</p>
                ) : sessionData ? (
                    <div className={styles.detailsBox}>
                        <h2 className={styles.detailsTitle}>Booking Details</h2>
                        <ul className={styles.detailsList}>
                            <li><strong>Ticket Name:</strong> {meta.name}</li>
                            <li><strong>Booking Date:</strong> {meta.date}</li>
                            <li><strong>Entry Time:</strong> {meta.time}</li>
                            <li><strong>Adult Tickets:</strong> {meta.adult}</li>
                            <li><strong>Child Tickets:</strong> {meta.child}</li>
                            <li><strong>Total Price:</strong> €{(sessionData.amount_total / 100).toFixed(2)}</li>
                        </ul>
                        <h2 className={styles.detailsTitle}>Customer Details</h2>
                        <ul className={styles.detailsList}>
                            <li><strong>Name:</strong> {meta.fullName}</li>
                            <li><strong>Email:</strong> {meta.email}</li>
                            <li><strong>Phone:</strong> {meta.phone}</li>
                        </ul>
                        <p className={styles.session}>
                            Order Reference: <span className={styles.code}>{sessionId?.slice(-10)}</span>
                        </p>
                    </div>
                ) : null}

                <p className={styles.text} style={{ marginTop: '20px' }}>
                    We have sent a confirmation email with your ticket details to the email address provided.
                    Please check your inbox (and spam folder) within the next few minutes.
                </p>

                <Link href="/" className={styles.homeBtn}>
                    Return to Home
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <>
            <Nav />
            <main className="page-main">
                <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
        </>
    );
}
