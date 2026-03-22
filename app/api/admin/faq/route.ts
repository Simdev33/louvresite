import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'faq.json');

export interface FAQItem {
    id: string;
    question: Record<string, string>;
    answer: Record<string, string>;
}

async function loadFAQs(): Promise<FAQItem[]> {
    const { data: row } = await supabase.from('site_data').select('data').eq('id', 'faq').single();
    return row?.data || [];
}
async function saveFAQs(data: FAQItem[]) {
    const { error } = await supabase.from('site_data').upsert({ id: 'faq', data: data });
    if (error) console.error('Error saving:', error);
}
export async function GET() {
    const faqs = await loadFAQs();
    return NextResponse.json({ faqs });
}

export async function POST(request: Request) {
    try {
        const { faqs } = await request.json();
        if (!Array.isArray(faqs)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        await saveFAQs(faqs);
        return NextResponse.json({ success: true, faqs });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update FAQs' }, { status: 500 });
    }
}
