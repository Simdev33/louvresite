import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'about.json');

async function loadAbout() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'about').single();
    return row?.data || {};
}
async function saveAbout(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'about', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const about = await loadAbout();
    return NextResponse.json({ about });
}

export async function POST(request: Request) {
    try {
        const { about } = await request.json();
        if (!about || typeof about !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveAbout(about);
        return NextResponse.json({ success: true, about });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
    }
}
