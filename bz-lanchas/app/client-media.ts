import { existsSync } from "node:fs";
import path from "node:path";

type ClientAsset = {
  src: string;
  // Record the client's original delivery, not just the asset's filename.
  clientSource: string;
};

// Only register media after verifying that the client supplied authentic footage
// or photographs of FÊNIX 27.5 “Gratidão”. See MEDIA_POLICY.md.
const approvedMedia: {
  boatPhoto: ClientAsset | null;
  heroPoster: ClientAsset | null;
  heroVideo: ClientAsset | null;
  heroMobilePoster: ClientAsset | null;
  heroMobileVideo: ClientAsset | null;
} = {
  boatPhoto: {
    src: "/images/fenix-275-gratidao.webp",
    clientSource: "Client attachment 1000716633.mp4, original frame at 00:26; media/provenance.json",
  },
  heroPoster: {
    src: "/images/fenix-275-gratidao.webp",
    clientSource: "Client attachment 1000716633.mp4, original frame at 00:26; media/provenance.json",
  },
  heroVideo: {
    src: "/videos/bz-hero-desktop.mp4",
    clientSource: "Client attachment 1000716633.mp4, continuous segment 00:24–00:36; media/provenance.json",
  },
  heroMobilePoster: {
    src: "/images/bz-hero-mobile.webp",
    clientSource: "Client attachment 1000717086.mp4, original frame at 00:07.5; media/provenance.json",
  },
  heroMobileVideo: {
    src: "/videos/bz-hero-mobile.mp4",
    clientSource: "Client attachment 1000717086.mp4, continuous segment 00:00–00:12; media/provenance.json",
  },
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
  };
}
