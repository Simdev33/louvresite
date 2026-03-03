import { supabase } from '@/lib/supabase';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: tickets, error: ticketsError } = await supabase.from('tickets').select('*');
  const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*').eq('status', 'approved');

  let publicTickets: any[] = [];
  if (!ticketsError) {
    publicTickets = (tickets || []).map((t: any) => {
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
  }

  publicTickets.sort((a, b) => Number(a.id) - Number(b.id));

  return <HomePageClient initialTickets={publicTickets} />;
}
