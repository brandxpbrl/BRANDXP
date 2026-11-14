"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (
    pathname === "/brandexperience/crm-nz" ||
    pathname.startsWith("/brandexperience/crm-nz/") ||
    pathname === "/bzlanchas" ||
    pathname.startsWith("/bzlanchas/") ||
    pathname === "/ferinha-cultural" ||
    pathname === "/zaptdeliverybz" ||
    pathname.startsWith("/zaptdeliverybz/") ||
    pathname === "/mell-stone" ||
    pathname.startsWith("/mell-stone/") ||
    pathname === "/projects/buzios-buggy" ||
    pathname.startsWith("/projects/buzios-buggy/") ||
    pathname === "/mpe" ||
    pathname.startsWith("/mpe/")
  ) {
    return null;
  }

  return <Navbar />;
}
