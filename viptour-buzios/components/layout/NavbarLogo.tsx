import Link from "next/link";
import { portalConfig } from "@/config/portal";

type NavbarLogoProps = {
  variant: "light" | "dark";
};

export function NavbarLogo({ variant }: NavbarLogoProps) {
  const textClass = variant === "light" ? "text-white" : "text-text-primary";
  const mutedClass = variant === "light" ? "text-white/60" : "text-text-secondary";

  return (
    <Link
      href="/"
      className="interactive flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
      aria-label={`${portalConfig.name} — Portal`}
    >
      <span
        aria-hidden="true"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
          variant === "light" ? "border-cyan-300/60" : "border-cyan-500/50"
        }`}
      >
        <span className="absolute h-6 w-6 rounded-full border border-cyan-300/75" />
        <span className="absolute h-3.5 w-3.5 rounded-full border border-fuchsia-300/35" />
        <span className="h-2 w-2 rounded-full bg-amber-100 shadow-[0_0_14px_rgba(254,240,138,0.95)]" />
      </span>
      <span className="hidden sm:flex flex-col leading-none">
        <span
          className={`text-[17px] tracking-[0.12em] ${textClass}`}
          style={{ fontFamily: "var(--font-orbis)" }}
        >
          ORBIS
        </span>
        <span className={`mt-1.5 text-[7px] font-semibold tracking-[0.26em] ${mutedClass}`}>
          EVERYTHING, CONNECTED.
        </span>
      </span>
    </Link>
  );
}
