'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function UserSync() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      // Call the API route to create/update user in our database
      fetch('/api/auth/user', {
        method: 'POST',
      }).catch((error) => {
        console.error('Error syncing user:', error);
      });
    }
  }, [isSignedIn]);

  return null;
} 