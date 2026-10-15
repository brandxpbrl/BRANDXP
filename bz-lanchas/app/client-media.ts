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
} = {
  boatPhoto: null,
  heroPoster: null,
  heroVideo: null,
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
  };
}
