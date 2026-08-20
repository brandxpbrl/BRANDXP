import Link from "next/link";
import type { ComponentProps } from "react";

type FragmaButtonProps = ComponentProps<typeof Link> & { variant?: "earth" | "light" };

export function FragmaButton({ className = "", variant = "earth", ...props }: FragmaButtonProps) {
  return <Link {...props} className={`fragma-button fragma-button-${variant} ${className}`} />;
}
