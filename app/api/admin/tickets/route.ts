import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: tickets, error } = await supabase.from('tickets').select('*');
    if (error) throw error;

    return NextResponse.json({ tickets: tickets || [] });
  } catch (error) {
    console.error('Failed to fetch admin tickets:', error);
    return NextResponse.json({ tickets: [] });
  }
}
