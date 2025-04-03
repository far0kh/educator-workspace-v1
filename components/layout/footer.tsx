import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-2 px-4 md:px-8 text-center text-sm text-muted-foreground">
      <p>{`©${new Date().getFullYear()} All Rights Reserved.`}</p>
    </footer>
  );
} 