"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (
    pathname === "/zaptdeliverybz" ||
    pathname.startsWith("/zaptdeliverybz/") ||
    pathname === "/mell-stone" ||
    pathname.startsWith("/mell-stone/")
  ) {
    return null;
  }

  return <Navbar />;
}
