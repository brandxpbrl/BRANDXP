import type { FragmaSectionProps } from "./types";

export function FragmaSection({ children, className = "", id }: FragmaSectionProps) {
  return <section id={id} className={`fragma-section ${className}`}>{children}</section>;
}
