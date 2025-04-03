'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function UserSync() {
  // const { isSignedIn, userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user.id) {
      // Call the API route to create/update user in our database
      fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id, email: user?.emailAddresses[0]?.emailAddress || '' }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }
        })
        .catch((error) => {
          console.error('Error syncing user:', error);
          setError(error.message);
        });
    }
  }, [isSignedIn, user]);

  // You can add UI to display errors if needed
  if (error) {
    console.error('User sync error:', error);
  }

  return null;
} 