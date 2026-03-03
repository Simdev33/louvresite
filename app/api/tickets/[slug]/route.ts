import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('slug', slug)
    .single();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
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

  ticket.averageRating = averageRating.toFixed(1);
  ticket.reviewCount = ticketReviews.length;

  return NextResponse.json(ticket);
}
