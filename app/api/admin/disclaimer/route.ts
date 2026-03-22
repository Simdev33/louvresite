import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'disclaimer.json');

async function loadDisclaimer() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'disclaimer').single();
    return row?.data || {};
}
async function saveDisclaimer(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'disclaimer', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const disclaimer = await loadDisclaimer();
    return NextResponse.json({ disclaimer });
}

export async function POST(request: Request) {
    try {
        const { disclaimer } = await request.json();
        if (!disclaimer || typeof disclaimer !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveDisclaimer(disclaimer);
        return NextResponse.json({ success: true, disclaimer });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update disclaimer' }, { status: 500 });
    }
}
