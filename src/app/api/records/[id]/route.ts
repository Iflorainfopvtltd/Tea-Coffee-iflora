import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TeaCoffeeRecord } from '@/models/Record';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { date, session: recordSession, tea, coffee, note } = body;
    const sessionVal = body.session || recordSession;

    await connectToDatabase();

    const updatedRecord = await TeaCoffeeRecord.findByIdAndUpdate(
      id,
      {
        ...(date && { date }),
        ...(sessionVal && { session: sessionVal === 'Evening' ? 'Evening' : 'Morning' }),
        ...(tea !== undefined && { tea: Math.max(0, parseInt(tea, 10) || 0) }),
        ...(coffee !== undefined && { coffee: Math.max(0, parseInt(coffee, 10) || 0) }),
        ...(note !== undefined && { note: String(note).trim() }),
      },
      { new: true }
    );

    if (!updatedRecord) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Record updated successfully',
      record: updatedRecord,
    });
  } catch (error: unknown) {
    console.error('Update record error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const deletedRecord = await TeaCoffeeRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Delete record error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

