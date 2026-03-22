import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function loadCompany() {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'company').single();
    return row?.data || {};
}

export async function GET() {
    try {
        const data = await loadCompany();
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
        });
    } catch (error) {
        console.error('Failed to read company data:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { error } = await supabase.from('site_data').upsert({ id: 'company', data });
        if (error) {
            console.error('Error saving company:', error);
            return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update company data:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
