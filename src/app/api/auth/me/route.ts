import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { seedAdminIfNotExists } from '@/models/Admin';

export async function GET() {
  try {
    await connectToDatabase();
    await seedAdminIfNotExists();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      admin: session,
    });
  } catch (error: unknown) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false, admin: null }, { status: 500 });
  }
}

