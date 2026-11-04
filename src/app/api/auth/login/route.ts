import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin, seedAdminIfNotExists } from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter email and password' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    // Ensure admin user exists in mongodb database 'teadata' -> collection 'admin'
    await seedAdminIfNotExists();

    const normalizedEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password: first try bcrypt, then direct match (in case plaintext was seeded)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, admin.password);
    } catch {
      isMatch = false;
    }

    if (!isMatch && admin.password === password) {
      isMatch = true;
      // Upgrade to hashed password
      admin.password = await bcrypt.hash(password, 10);
      await admin.save();
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = signToken({
      id: String(admin._id),
      name: admin.name || 'Iflora',
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name || 'Iflora',
        email: admin.email,
      },
    });

    // Set cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Server error: ' + msg },
      { status: 500 }
    );
  }
}

