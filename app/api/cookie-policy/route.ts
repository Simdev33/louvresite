import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function loadCookiePolicy() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'cookie-policy').single();
    if (row?.data && Object.keys(row.data).length > 0) return row.data;

    try {
        const filePath = path.join(process.cwd(), 'data', 'cookie-policy.json');
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const allPolicies = await loadCookiePolicy();
    const text = allPolicies[lang] || allPolicies['en'] || '';

    return NextResponse.json({ text }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}
