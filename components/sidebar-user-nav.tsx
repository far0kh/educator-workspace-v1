'use client';
import { ChevronUp, Power } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useUser, useClerk } from "@clerk/nextjs";
import { truncateEmail } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SidebarUserNav() {
  const { setTheme, theme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const deletePromise = fetch(`/api/chat?id=all`, {
      method: 'DELETE',
      signal: controller.signal,
    }).then(() => {
      clearTimeout(timeoutId);
      router.push('/chat');
    });

    toast.promise(deletePromise, {
      loading: 'Deleting chats...',
      success: () => {
        location.reload();
        return 'Chats deleted successfully';
      },
      error: 'Failed to delete chats',
    });

    setShowDeleteDialog(false);
  };

  if (!user) return null;

  return (
    <>
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
                onSelect={() => setShowDeleteDialog(true)}
              >
                Delete all chats
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
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chats and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
