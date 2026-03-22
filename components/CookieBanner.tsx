'use client';

import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShow(false);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cookie_consent_accepted'));
        }
    };

    const decline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="16" cy="10" r="1"></circle>
                            <circle cx="8" cy="14" r="1"></circle>
                            <circle cx="12" cy="15" r="1"></circle>
                            <circle cx="9" cy="9" r="1"></circle>
                            <circle cx="15" cy="14" r="1"></circle>
                        </svg>
                    </div>
                    <div className={styles.titleContainer}>
                        <h2>We Value Your Privacy</h2>
                        <p className={styles.subtitle}>Manage your cookie preferences</p>
                    </div>
                </div>

                <div className={styles.body}>
                    <p>
                        We use necessary cookies to make our site work. We'd also like to set optional analytics cookies to help us improve it.
                        We won't set optional cookies unless you enable them. Using this tool will set a cookie on your device to remember your preferences.
                    </p>
                </div>

                <div className={styles.footer}>
                    <button onClick={decline} className={styles.declineButton}>
                        Reject Optional
                    </button>
                    <button onClick={accept} className={styles.acceptButton}>
                        Accept All Cookies
                    </button>
                </div>
            </div>
        </div>
    );
}
