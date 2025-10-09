import { Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Logo and Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Where To Eat Ah? Logo"
              width={48}
              height={48}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl text-foreground">
              Where To Eat Ah?
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium hidden sm:block">
              Find open hawker centers in Singapore
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-sm font-medium transition-all hover:text-primary px-2 py-1 rounded-md hover:bg-primary/5"
          >
            Map
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-all hover:text-primary px-2 py-1 rounded-md hover:bg-primary/5 flex items-center gap-1.5"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
