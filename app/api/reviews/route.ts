import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        let query = supabase.from('reviews').select('*').eq('status', 'approved');

        if (slug) {
            query = query.eq('ticketSlug', slug);
        }

        const { data: reviews, error } = await query;

        if (error) throw error;

        return NextResponse.json({ reviews: reviews || [] });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return NextResponse.json({ reviews: [] });
    }
}
