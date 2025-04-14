import { auth } from '@clerk/nextjs/server';
import { deleteChatsByUserId } from '@/lib/db/queries';

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatsByUserId({ id: session.userId });

    return new Response('All chats deleted', { status: 200 });
  } catch (error) {
    console.error('Failed to delete all chats:', error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
