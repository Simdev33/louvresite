'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function TrackingScripts() {
    const [scripts, setScripts] = useState<{ gtm_id?: string, ga4_id?: string, ads_id?: string } | null>(null);
    const [consent, setConsent] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/admin/tracking')
            .then(res => res.json())
            .then(data => {
                if (data.tracking) setScripts(data.tracking);
            })
            .catch(console.error);

        if (localStorage.getItem('cookie_consent') === 'true') {
            setConsent(true);
        }

        const handleStorageChange = () => {
            if (localStorage.getItem('cookie_consent') === 'true') setConsent(true);
        };
        window.addEventListener('storage', handleStorageChange);

        const handleCustomConsent = () => setConsent(true);
        window.addEventListener('cookie_consent_accepted', handleCustomConsent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cookie_consent_accepted', handleCustomConsent);
        };
    }, []);

    useEffect(() => {
        if (consent && scripts) {
            if (scripts.gtm_id && typeof window !== 'undefined' && (window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'pageview',
                    page_path: pathname,
                });
            }
        }
    }, [pathname, consent, scripts]);

    if (!consent || !scripts) return null;

    return (
        <>
            {scripts.gtm_id && (
                <Script
                    id="gtm-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${scripts.gtm_id}');
                        `,
                    }}
                />
            )}

            {scripts.ga4_id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${scripts.ga4_id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${scripts.ga4_id}', {
                                page_path: window.location.pathname,
                            });
                        `}
                    </Script>
                </>
            )}

            {scripts.ads_id && !scripts.ga4_id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${scripts.ads_id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ads-init" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${scripts.ads_id}');
                        `}
                    </Script>
                </>
            )}

            {scripts.ads_id && scripts.ga4_id && (
                <Script id="ads-config" strategy="afterInteractive">
                    {`
                        gtag('config', '${scripts.ads_id}');
                    `}
                </Script>
            )}
        </>
    );
}
