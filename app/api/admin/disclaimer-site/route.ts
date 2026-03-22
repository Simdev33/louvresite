import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'disclaimer-site.json');

async function loadDisclaimerSite() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'disclaimer-site').single();
    return row?.data || {};
}
async function saveDisclaimerSite(data: Record<string, string>) {
    const { error } = await supabase.from('site_data').upsert({ id: 'disclaimer-site', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const disclaimerSite = await loadDisclaimerSite();
    return NextResponse.json({ disclaimerSite });
}

export async function POST(request: Request) {
    try {
        const { disclaimerSite } = await request.json();
        if (!disclaimerSite || typeof disclaimerSite !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveDisclaimerSite(disclaimerSite);
        return NextResponse.json({ success: true, disclaimerSite });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update disclaimer site' }, { status: 500 });
    }
}
