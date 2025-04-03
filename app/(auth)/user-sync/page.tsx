import { auth, clerkClient } from '@clerk/nextjs/server';
import { createUser, getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function UserSyncPage() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  const users = await getUser(userId)

  // If user doesn't exist, create them
  if (users.length === 0) {
    const client = await clerkClient()

    const user = userId ? await client.users.getUser(userId) : null

    if (user && user.id && user.emailAddresses.length > 0) {
      await createUser(userId, user.emailAddresses[0].emailAddress)
      console.log(user.emailAddresses[0].emailAddress);

    } else {
      console.error('No email found for user:', userId)
      return redirectToSignIn()
    }
  }

  return redirect('/chat')
}
