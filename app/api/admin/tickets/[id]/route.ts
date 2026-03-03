import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let body: Record<string, unknown>;
  try {
    body = await _req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const allowed = [
    'name', 'priceAdult', 'priceChild', 'stock', 'duration',
    'longDescription', 'included', 'notIncluded', 'important',
    'meetingPoint', 'mapSrc', 'closures', 'thumbnail', 'images', 'slug',
    'openingTime', 'closingTime'
  ];

  const updateData: Record<string, unknown> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      let val = body[key];
      if (typeof val === 'string') {
        let s = val as string;
        s = s.replace(/&nbsp;/g, ' ');
        s = s.replace(/\s*style="[^"]*"/gi, '');
        val = s;
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        const objVal = val as Record<string, string>;
        for (const k in objVal) {
          if (typeof objVal[k] === 'string') {
            objVal[k] = objVal[k].replace(/&nbsp;/g, ' ');
            objVal[k] = objVal[k].replace(/\s*style="[^"]*"/gi, '');
          }
        }
      }
      updateData[key] = val;
    }
  }

  const { data: updatedTicket, error } = await supabase
    .from('tickets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !updatedTicket) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }

  // Clear Next.js cache so the public site sees the updates immediately
  revalidatePath('/', 'layout');

  return NextResponse.json({ ticket: updatedTicket });
}
