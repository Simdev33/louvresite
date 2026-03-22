import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('gtm_id, ga4_id, ads_id')
            .eq('id', 'tracking_ids')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching tracking IDs:', error);
            return NextResponse.json({ tracking: {} });
        }

        return NextResponse.json({ tracking: data || {} });
    } catch (err) {
        console.error('Error fetching tracking IDs:', err);
        return NextResponse.json({ tracking: {} });
    }
}

export async function POST(request: Request) {
    try {
        const { tracking } = await request.json();
        if (!tracking || typeof tracking !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const { error } = await supabase
            .from('settings')
            .upsert({
                id: 'tracking_ids',
                gtm_id: tracking.gtm_id || null,
                ga4_id: tracking.ga4_id || null,
                ads_id: tracking.ads_id || null
            });

        if (error) {
            console.error('Error saving tracking IDs:', error);
            return NextResponse.json({ error: 'Failed to update tracking IDs' }, { status: 500 });
        }

        return NextResponse.json({ success: true, tracking });
    } catch (err) {
        console.error('Error in POST /api/admin/tracking:', err);
        return NextResponse.json({ error: 'Failed to update tracking IDs' }, { status: 500 });
    }
}
