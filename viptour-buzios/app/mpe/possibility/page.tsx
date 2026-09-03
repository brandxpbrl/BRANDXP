import type { Metadata } from "next";
import MpePossibilitySurface from "./MpePossibilitySurface";

export const metadata: Metadata = {
  title: "MPE Possibility Engine | ORBIS",
  description: "Explora posibilidades viables sin confundir candidatos con evidencia.",
};

export default function MpePossibilityPage() {
  return <MpePossibilitySurface />;
}
