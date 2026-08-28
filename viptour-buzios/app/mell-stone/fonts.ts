import { Cormorant_Garamond, Manrope } from "next/font/google";

export const mellDisplayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--mell-font-display",
  display: "swap",
});

export const mellBodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--mell-font-body",
  display: "swap",
});
