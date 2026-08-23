import Link from "next/link";
import { portalConfig } from "@/config/portal";

type NavbarLogoProps = {
  variant: "light" | "dark";
};

export function NavbarLogo({ variant }: NavbarLogoProps) {
  const textClass = variant === "light" ? "text-white" : "text-text-primary";
  const mutedClass = variant === "light" ? "text-white/55" : "text-text-secondary";

  return (
    <Link
      href="/"
      className="interactive flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
      aria-label={`${portalConfig.name} — Portal`}
    >
      <span
        aria-hidden="true"
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border ${
          variant === "light" ? "border-cyan-300/55" : "border-cyan-500/45"
        }`}
      >
        <span className="absolute h-5 w-5 rounded-full border border-cyan-300/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(253,230,138,0.9)]" />
      </span>
      <span className="hidden sm:flex flex-col leading-none">
        <span className={`text-lg font-semibold tracking-[0.16em] ${textClass}`}>ORBIS</span>
        <span className={`mt-1 text-[7px] font-semibold tracking-[0.24em] ${mutedClass}`}>
          EVERYTHING, CONNECTED.
        </span>
      </span>
    </Link>
  );
}
