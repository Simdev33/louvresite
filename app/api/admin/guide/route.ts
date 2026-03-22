import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadGuide(): Promise<Record<string, string>> {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'guide').single();
    return row?.data || {};
}
async function saveGuide(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'guide', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const content = await loadGuide();
    return NextResponse.json({ content }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}

export async function POST(request: Request) {
    try {
        const { guideData } = await request.json();

        if (!guideData || typeof guideData !== 'object') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await saveGuide(guideData);

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update guide' }, { status: 500 });
    }
}
