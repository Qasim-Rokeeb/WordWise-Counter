
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <header className={cn(
      "px-4 lg:px-6 h-14 flex items-center top-0 left-0 right-0 z-50",
      isLandingPage ? "fixed bg-background/30 backdrop-blur-sm" : "absolute"
    )}>
      <Link href="/" className="flex items-center justify-center">
        <span className="text-xl font-bold">WordWise</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="/word-counter"
        >
          <Button variant="ghost">Counter</Button>
        </Link>
        <Link
          href="/#features"
        >
           <Button variant="ghost">Features</Button>
        </Link>
      </nav>
    </header>
  );
}
