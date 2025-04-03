import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from "next/server";
import { createUser, getUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    const reqBody = await request.json();

    const { user_id, email } = reqBody;

    if (!userId || userId !== user_id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user exists in our database
    const users = await getUser(userId);

    // If user doesn't exist, create them
    if (users.length === 0) {
      if (email) {
        await createUser(userId, email);
      } else {
        console.error('No email found for user:', userId);
        return new NextResponse('Email is required', { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 