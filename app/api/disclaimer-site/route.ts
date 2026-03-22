import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadDisclaimerSite() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'disclaimer-site').single();
    return row?.data || {};
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const allDisclaimerSite = await loadDisclaimerSite();
    // Fallback to English if not found
    const text = allDisclaimerSite[lang] || allDisclaimerSite['en'] || '';

    return NextResponse.json({ text }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}
