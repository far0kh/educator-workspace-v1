import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/db/queries';

export async function POST() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user exists in our database
    const users = await getUser(userId);

    // If user doesn't exist, create them
    if (users.length === 0) {
      const email = sessionClaims?.email as string;
      await createUser(userId, email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 