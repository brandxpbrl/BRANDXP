import Image from "next/image";
import Link from "next/link";
import { brandStrategy } from "@/brand/brand.strategy";

type NavbarLogoProps = {
  variant: "light" | "dark";
};

export function NavbarLogo({ variant }: NavbarLogoProps) {
  const shellClass =
    variant === "light"
      ? "bg-white/90 ring-white/30"
      : "bg-white ring-black/5";

  return (
    <Link
      href="/"
      className="interactive flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
      aria-label={`${brandStrategy.identity} — Portal`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-full p-1.5 shadow-sm ring-1 ${shellClass}`}>
        <Image
          src="/brand/logo-viptour.png"
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span className="sr-only">{brandStrategy.identity}</span>
    </Link>
  );
}
