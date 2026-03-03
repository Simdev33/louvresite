import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Read JSON files
        const ticketsPath = path.join(process.cwd(), 'data', 'tickets.json');
        const reviewsPath = path.join(process.cwd(), 'data', 'reviews.json');

        const ticketsRaw = readFileSync(ticketsPath, 'utf-8');
        const tickets = JSON.parse(ticketsRaw);

        let reviews = [];
        try {
            reviews = JSON.parse(readFileSync(reviewsPath, 'utf-8'));
        } catch (e) {
            console.log('No reviews found or error reading reviews.json');
        }

        console.log(`Found ${tickets.length} tickets and ${reviews.length} reviews to migrate.`);

        // 2. Insert tickets
        for (const ticket of tickets) {
            const { error } = await supabase.from('tickets').upsert({
                id: ticket.id,
                slug: ticket.slug,
                name: ticket.name,
                duration: ticket.duration || null,
                priceAdult: ticket.priceAdult || 0,
                priceChild: ticket.priceChild || 0,
                stock: ticket.stock || 0,
                thumbnail: ticket.thumbnail || null,
                images: ticket.images || null,
                longDescription: ticket.longDescription || null,
                included: ticket.included || null,
                notIncluded: ticket.notIncluded || null,
                important: ticket.important || null,
                meetingPoint: ticket.meetingPoint || null,
                mapSrc: ticket.mapSrc || null,
                closures: ticket.closures || null,
                openingTime: ticket.openingTime || null,
                closingTime: ticket.closingTime || null,
            }, { onConflict: 'slug' });

            if (error) {
                console.error(`Error inserting ticket ${ticket.slug}:`, error);
                return NextResponse.json({ error: `Failed to insert ticket ${ticket.slug}`, details: error }, { status: 500 });
            }
        }

        // 3. Insert reviews
        // Clear old reviews first to avoid duplicates during multiple seed runs
        const { error: deleteError } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
            console.error('Error clearing old reviews:', deleteError);
        }

        for (const review of reviews) {
            const { error } = await supabase.from('reviews').insert({
                ticketSlug: review.ticketSlug,
                userName: review.userName,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt || new Date().toISOString(),
                status: review.status || 'approved'
            });

            if (error) {
                console.error(`Error inserting review for ${review.ticketSlug}:`, error);
                // Continue even if one review fails
            }
        }

        return NextResponse.json({ success: true, message: `Successfully migrated ${tickets.length} tickets and ${reviews.length} reviews to Supabase!` });
    } catch (err: any) {
        console.error('Seeding error:', err);
        return NextResponse.json({ error: 'Failed to seed database', details: err.message }, { status: 500 });
    }
}
