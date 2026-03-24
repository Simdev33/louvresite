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

async function saveCookiePolicy(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'cookie-policy', data: data });
    if (error) console.error('Error saving:', error);
}

export async function GET() {
    const cookiePolicy = await loadCookiePolicy();
    return NextResponse.json({ cookiePolicy }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
}

export async function POST(request: Request) {
    try {
        const { cookiePolicy } = await request.json();
        if (!cookiePolicy || typeof cookiePolicy !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveCookiePolicy(cookiePolicy);
        return NextResponse.json({ success: true, cookiePolicy });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update cookie policy' }, { status: 500 });
    }
}
