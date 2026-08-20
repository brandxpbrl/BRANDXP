import { Manrope, Playfair_Display } from "next/font/google";

export const fragmaDisplayFont = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--fragma-font-display", display: "swap" });
export const fragmaBodyFont = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--fragma-font-body", display: "swap" });
