import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadTerms() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'terms').single();
    return row?.data || {};
}
async function saveTerms(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'terms', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const terms = await loadTerms();
    return NextResponse.json({ terms }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}

export async function POST(request: Request) {
    try {
        const { terms } = await request.json();
        if (!terms || typeof terms !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveTerms(terms);
        return NextResponse.json({ success: true, terms });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update terms' }, { status: 500 });
    }
}
