import { auth, clerkClient } from '@clerk/nextjs/server';
import { createUser, getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function UserSyncPage() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  try {
    // Check if user exists in our database
    const dbUsers = await getUser(userId)

    // If user doesn't exist, create them
    if (dbUsers.length === 0) {
      const client = await clerkClient()
      const user = userId ? await client.users.getUser(userId) : null
      if (user && user.id && user.emailAddresses.length > 0) {
        await createUser(userId, user.emailAddresses[0].emailAddress)
      } else {
        return redirectToSignIn()
      }
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return redirectToSignIn()
  }

  return redirect('/chat')
}
