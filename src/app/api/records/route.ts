import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TeaCoffeeRecord } from '@/models/Record';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month'); // e.g., '2026-11'
    const search = searchParams.get('search'); // note or general search

    interface QueryFilter {
      date?: string | { $regex: string };
      note?: { $regex: string; $options: string };
    }

    const query: QueryFilter = {};

    if (date) {
      query.date = date;
    } else if (month) {
      // Matches any date starting with "YYYY-MM"
      query.date = { $regex: `^${month}` };
    }

    if (search) {
      query.note = { $regex: search, $options: 'i' };
    }

    const records = await TeaCoffeeRecord.find(query).sort({ date: -1, createdAt: -1 }).lean();

    const totalTea = records.reduce((acc, curr) => acc + (Number(curr.tea) || 0), 0);
    const totalCoffee = records.reduce((acc, curr) => acc + (Number(curr.coffee) || 0), 0);
    const grandTotal = totalTea + totalCoffee;

    return NextResponse.json({
      success: true,
      records,
      totals: {
        tea: totalTea,
        coffee: totalCoffee,
        grandTotal,
        count: records.length,
      },
    });
  } catch (error: unknown) {
    console.error('Fetch records error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, session: recordSession, tea, coffee, note } = body;
    const sessionVal = body.session || recordSession;

    if (!date) {
      return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
    }

    await connectToDatabase();

    const newRecord = await TeaCoffeeRecord.create({
      date,
      session: sessionVal === 'Evening' ? 'Evening' : 'Morning',
      tea: Math.max(0, parseInt(tea, 10) || 0),
      coffee: Math.max(0, parseInt(coffee, 10) || 0),
      note: note ? String(note).trim() : '',
    });

    return NextResponse.json({
      success: true,
      message: 'Record added successfully',
      record: newRecord,
    });
  } catch (error: unknown) {
    console.error('Create record error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
