import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://louvresite.netlify.app';

    const routes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${baseUrl}/cancellation`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ];

    try {
        const ticketsPath = path.join(process.cwd(), 'data', 'tickets.json');
        if (fs.existsSync(ticketsPath)) {
            const ticketsData = JSON.parse(fs.readFileSync(ticketsPath, 'utf8'));
            if (Array.isArray(ticketsData)) {
                ticketsData.forEach((ticket: any) => {
                    if (ticket.slug && ticket.isActive !== false) {
                        routes.push({
                            url: `${baseUrl}/${ticket.slug}`,
                            lastModified: new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.9,
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error('Failed to generate sitemap for tickets:', error);
    }

    return routes;
}
