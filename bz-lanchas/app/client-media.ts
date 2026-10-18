import { existsSync } from "node:fs";
import path from "node:path";

type ClientAsset = { src: string; clientSource: string };

const approvedMedia: {
  boatPhoto: ClientAsset | null;
  heroPoster: ClientAsset | null;
  heroVideo: ClientAsset | null;
  heroMobilePoster: ClientAsset | null;
  heroMobileVideo: ClientAsset | null;
  experiencePhoto: ClientAsset | null;
  interiorPhoto: ClientAsset | null;
  bowPhoto: ClientAsset | null;
} = {
  boatPhoto: { src: "/IMG-20261017-WA0134.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  heroPoster: { src: "/IMG-20261017-WA0134.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  heroVideo: { src: "/VID-20261017-WA0136.mp4", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  heroMobilePoster: { src: "/IMG-20261015-WA0164.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  heroMobileVideo: { src: "/VID-20261015-WA0165.mp4", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  experiencePhoto: { src: "/IMG-20261017-WA0150.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  interiorPhoto: { src: "/IMG-20261017-WA0140.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
  bowPhoto: { src: "/IMG-20261017-WA0141.jpg", clientSource: "Client delivery uploaded to GitHub on 2026-10-18." },
};

function localAsset(asset: ClientAsset | null): string | undefined {
  if (!asset?.clientSource.trim() || !asset.src.startsWith("/") || asset.src.startsWith("//")) return;
  const publicRoot = path.join(process.cwd(), "public");
  const file = path.resolve(publicRoot, `.${asset.src}`);
  if (!file.startsWith(`${publicRoot}${path.sep}`) || !existsSync(file)) return;
  return asset.src;
}

export function getClientMedia() {
  return {
    boatPhoto: localAsset(approvedMedia.boatPhoto),
    heroPoster: localAsset(approvedMedia.heroPoster),
    heroVideo: localAsset(approvedMedia.heroVideo),
    heroMobilePoster: localAsset(approvedMedia.heroMobilePoster),
    heroMobileVideo: localAsset(approvedMedia.heroMobileVideo),
    experiencePhoto: localAsset(approvedMedia.experiencePhoto),
    interiorPhoto: localAsset(approvedMedia.interiorPhoto),
    bowPhoto: localAsset(approvedMedia.bowPhoto),
  };
}
