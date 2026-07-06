import Link from "next/link";
import { portalConfig } from "@/config/portal";

type NavbarLogoProps = {
  variant: "light" | "dark";
};

export function NavbarLogo({ variant }: NavbarLogoProps) {
  const shellClass =
    variant === "light"
      ? "bg-sky-500 text-white ring-white/30"
      : "bg-sky-600 text-white ring-black/5";

  return (
    <Link
      href="/"
      className="interactive flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
      aria-label={`${portalConfig.name} — Portal`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md font-black tracking-tighter text-lg ring-1 ${shellClass}`}>
        BE
      </span>
      <span className="font-extrabold tracking-tight text-text-primary text-base hidden sm:inline">
        Brand Experience OS
      </span>
    </Link>
  );
}
