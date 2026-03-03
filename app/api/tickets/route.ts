import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: tickets, error: ticketsError } = await supabase.from('tickets').select('*');
        if (ticketsError) throw ticketsError;

        const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*').eq('status', 'approved');
        if (reviewsError) throw reviewsError;

        const publicTickets = (tickets || []).map((t: any) => {
            const ticketReviews = (reviews || []).filter((r: any) => r.ticketSlug === t.slug);
            let averageRating = 0;
            if (ticketReviews.length > 0) {
                const total = ticketReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                averageRating = total / ticketReviews.length;
            }

            return {
                id: t.id,
                slug: t.slug,
                name: t.name,
                duration: t.duration,
                priceAdult: t.priceAdult,
                thumbnail: t.thumbnail,
                longDescription: t.longDescription,
                averageRating: averageRating.toFixed(1),
                reviewCount: ticketReviews.length
            };
        });

        publicTickets.sort((a, b) => Number(a.id) - Number(b.id));

        return NextResponse.json({ tickets: publicTickets });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json({ tickets: [] });
    }
}
