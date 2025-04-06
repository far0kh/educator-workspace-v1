'use client';
import { ChevronUp, Power } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useUser, useClerk } from "@clerk/nextjs";
import { truncateEmail } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SignOutForm } from './sign-out-form';

export function SidebarUserNav() {
  const { setTheme, theme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              {user.hasImage &&
                <Image
                  src={user.imageUrl}
                  alt="User Avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              }
              <span className="truncate">{truncateEmail(user.emailAddresses[0]?.emailAddress || '')}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-68 md:w-60"
          >
            <DropdownMenuItem
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => signOut({ redirectUrl: '/' })}
            >
              <Power className="h-4 w-4 text-red-500" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
