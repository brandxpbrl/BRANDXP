import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobe = process.env.FFPROBE_PATH || "ffprobe";
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
};
const hash = file => createHash("sha256").update(readFileSync(path.join(root, file))).digest("hex");
const probe = file => JSON.parse(run(ffprobe, ["-v", "error", "-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate", "-of", "json", file]));

mkdirSync(path.join(root, "public/videos"), { recursive: true });
mkdirSync(path.join(root, "public/images"), { recursive: true });

const sources = ["1000716633", "1000717086", "1000718566", "1000716629"].map(name => {
  const file = `media/originals/${name}.mp4`;
  return { file, sha256: hash(file), ...probe(file) };
});
const videos = [
  { source: "media/originals/1000716633.mp4", output: "public/videos/bz-hero-desktop.mp4", start: 24, duration: 12, maxrate: "1600k", bufsize: "3200k" },
  { source: "media/originals/1000717086.mp4", output: "public/videos/bz-hero-mobile.mp4", start: 0, duration: 12, maxrate: "1000k", bufsize: "2000k" },
];
const frames = [
  { source: "media/originals/1000716633.mp4", output: "public/images/fenix-275-gratidao.webp", at: 26, quality: 90, usage: "boat photo and desktop/tablet hero poster" },
  { source: "media/originals/1000717086.mp4", output: "public/images/bz-hero-mobile.webp", at: 7.5, quality: 88, usage: "mobile hero poster" },
];

for (const job of videos) {
  const args = ["-hide_banner", "-loglevel", "error", "-ss", String(job.start), "-i", job.source, "-t", String(job.duration), "-map", "0:v:0", "-an", "-sn", "-dn", "-vf", "fps=30,setsar=1", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", job.maxrate, "-bufsize", job.bufsize, "-pix_fmt", "yuv420p", "-profile:v", "high", "-level:v", "3.1", "-movflags", "+faststart", "-map_metadata", "-1", "-map_chapters", "-1", "-threads", "2", "-y", job.output];
  run(ffmpeg, args);
  Object.assign(job, { args, bytes: statSync(path.join(root, job.output)).size, sha256: hash(job.output), probe: probe(job.output) });
  console.log(`${job.output}: ${job.bytes} bytes`);
}
for (const job of frames) {
  const args = ["-hide_banner", "-loglevel", "error", "-ss", String(job.at), "-i", job.source, "-map", "0:v:0", "-frames:v", "1", "-an", "-c:v", "libwebp", "-quality", String(job.quality), "-compression_level", "6", "-map_metadata", "-1", "-y", job.output];
  run(ffmpeg, args);
  Object.assign(job, { args, bytes: statSync(path.join(root, job.output)).size, sha256: hash(job.output), probe: probe(job.output) });
  console.log(`${job.output}: ${job.bytes} bytes`);
}
writeFileSync(path.join(root, "media/provenance.json"), `${JSON.stringify({
  suppliedBy: "Client, explicitly authenticated in the attached task instructions on 2026-10-15",
  vessel: "FÊNIX 27.5 — Gratidão",
  transformations: "Continuous cuts, H.264/WebP compression and original-frame extraction only. No audio, generated content, retouching, compositing, optical interpolation, transitions or color changes. Original spatial resolution retained. Native loop restarts the original continuous segment.",
  ffmpegVersion: run(ffmpeg, ["-version"]).split(/\r?\n/)[0],
  sources, videos, frames,
  reservedForFutureUse: ["media/originals/1000718566.mp4", "media/originals/1000716629.mp4"],
}, null, 2)}\n`);
