import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadAbout() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'about').single();
    return row?.data || {};
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const allAbout = await loadAbout();
    // Fallback to English if the requested language is not found
    const text = allAbout[lang] || allAbout['en'] || '';

    return NextResponse.json({ text });
}
