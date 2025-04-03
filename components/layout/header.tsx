import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import Image from "next/image";
import ButtonCustom from "@/components/ui-custom/button-custom";

export function Header() {
  return (
    <header className='border-b py-2 px-4 md:px-8' dir="ltr">
      <nav className='flex items-center justify-between'>
        <div className="flex gap-5 item-center">
          <Link href="/" className="flex items-center space-x-1 rtl:space-x-reverse">
            <Image src="/logo.webp" className="w-auto h-8 md:h-10" width={120} height={40} alt="Logo" />
          </Link>
        </div>
        <div className='flex items-center justify-between gap-4'>
          <SignedOut>
            <SignInButton>
              <ButtonCustom
                className="flex text-white font-semibold"
                violet
              >
                Sign in
              </ButtonCustom>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                layout: {
                  logoPlacement: "none",
                },
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
} 