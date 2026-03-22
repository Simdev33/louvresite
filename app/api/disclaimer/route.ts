import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadDisclaimer() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'disclaimer').single();
    return row?.data || {};
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const allDisclaimers = await loadDisclaimer();
    // Fallback to English if the requested language is not found
    const text = allDisclaimers[lang] || allDisclaimers['en'] || '';

    return NextResponse.json({ text }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}
