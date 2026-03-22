import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'privacy.json');

async function loadPrivacy() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'privacy').single();
    return row?.data || {};
}
async function savePrivacy(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'privacy', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const privacy = await loadPrivacy();
    return NextResponse.json({ privacy });
}

export async function POST(request: Request) {
    try {
        const { privacy } = await request.json();
        if (!privacy || typeof privacy !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await savePrivacy(privacy);
        return NextResponse.json({ success: true, privacy });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update privacy policy' }, { status: 500 });
    }
}
