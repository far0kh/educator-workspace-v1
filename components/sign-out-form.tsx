'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';

export const SignOutForm = () => {
  const { signOut } = useClerk();

  return (
    <Button
      size='default'
      variant='ghost'
      type='button'
      onClick={() => signOut({ redirectUrl: '/' })}
      className='w-full'
    >
      Sign out
    </Button>
  )
}
