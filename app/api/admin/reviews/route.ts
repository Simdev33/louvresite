import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: reviews, error } = await supabase.from('reviews').select('*').order('createdAt', { ascending: false });
        if (error) throw error;

        // Map to old format for existing admin frontend
        const mappedReviews = (reviews || []).map(r => ({
            id: r.id,
            ticketSlug: r.ticketSlug,
            author: r.userName,
            rating: r.rating,
            text: r.comment,
            date: r.createdAt,
            status: r.status
        }));

        return NextResponse.json({ reviews: mappedReviews });
    } catch (err) {
        return NextResponse.json({ reviews: [] });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { data: newReview, error } = await supabase.from('reviews').insert({
            ticketSlug: body.ticketSlug,
            userName: body.author,
            rating: parseInt(body.rating, 10),
            comment: body.text,
            createdAt: body.date || new Date().toISOString(),
            status: body.status || 'approved'
        }).select().single();

        if (error) throw error;

        const mappedReview = {
            id: newReview.id,
            ticketSlug: newReview.ticketSlug,
            author: newReview.userName,
            rating: newReview.rating,
            text: newReview.comment,
            date: newReview.createdAt,
            status: newReview.status
        };

        revalidatePath('/', 'layout');

        return NextResponse.json({ review: mappedReview });
    } catch (err) {
        console.error('Failed to create review:', err);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
        }

        const { error } = await supabase.from('reviews').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
