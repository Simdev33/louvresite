import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'guide.json');

async function loadGuide() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'guide').single();
    return row?.data || {};
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const translations = await loadGuide();
    const text = translations[lang] || translations['en'] || '';

    return NextResponse.json({ text });
}
