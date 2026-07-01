"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 10;

export function useSmartHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 50);

      if (Math.abs(currentScrollY - lastScrollY) < SCROLL_THRESHOLD) {
        return;
      }

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { isVisible, isAtTop };
}
