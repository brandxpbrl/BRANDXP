"use client";

import { usePathname } from "next/navigation";
import SelfObserverIdentity from "@/components/system/SelfObserverIdentity";
import { MaxPublicObserver } from "@/components/max/MaxPublicObserver";

// Client-branded tour pages must not display ORBIS debugging/observer overlays.
// The observer components remain unchanged and available throughout ORBIS.
export function ClientObservers() {
  const pathname = usePathname();

  if (pathname === "/brandexperience/crm-nz" || pathname.startsWith("/brandexperience/crm-nz/") || pathname === "/projects/buzios-buggy" || pathname.startsWith("/projects/buzios-buggy/")) {
    return null;
  }

  return (
    <>
      <SelfObserverIdentity />
      <MaxPublicObserver />
    </>
  );
}
