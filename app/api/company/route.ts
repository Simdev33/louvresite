import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadCompany() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'company').single();
    return row?.data || {};
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    try {
        const data = await loadCompany();
        const localizedCompany = data[lang] || data['en'] || {};

        return NextResponse.json(localizedCompany, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
        });
    } catch (error) {
        console.error('Failed to read company data:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}
