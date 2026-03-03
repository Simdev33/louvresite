import { supabase } from '@/lib/supabase';
import { Nav } from '@/components/Nav';
import { TicketDetail } from '@/components/TicketDetail';
import { TicketReviews } from '@/components/TicketReviews';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DynamicTicketPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;

    const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('slug', slug)
        .single();

    if (ticketError || !ticket) {
        notFound();
    }

    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('ticketSlug', slug)
        .eq('status', 'approved');

    const ticketReviews = reviews || [];
    let averageRating = 0;
    if (ticketReviews.length > 0) {
        const total = ticketReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
        averageRating = total / ticketReviews.length;
    }

    const enhancedTicket = {
        ...ticket,
        averageRating: averageRating.toFixed(1),
        reviewCount: ticketReviews.length,
    };

    const mappedReviews = ticketReviews.map(r => ({
        id: r.id,
        ticketSlug: r.ticketSlug,
        author: r.userName,
        rating: r.rating,
        text: r.comment,
        date: r.createdAt
    }));

    return (
        <>
            <Nav />
            <main className="page-main">
                <TicketDetail ticket={enhancedTicket} />
                <TicketReviews reviews={mappedReviews} />
            </main>
        </>
    );
}
