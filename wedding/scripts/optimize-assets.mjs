import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_IMG = path.join(ROOT, 'src', 'img');
const PUB = path.join(ROOT, 'public');

const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + ' MB';

async function fileSize(p) {
  try { return (await stat(p)).size; } catch { return 0; }
}

async function convertImage(srcPath, outPath, { width, quality = 75 }) {
  const before = await fileSize(srcPath);
  const pipeline = sharp(srcPath, { failOn: 'none' }).rotate();
  if (width) pipeline.resize({ width, withoutEnlargement: true });
  await pipeline.webp({ quality }).toFile(outPath);
  const after = await fileSize(outPath);
  console.log(`  ${path.basename(srcPath)} -> ${path.basename(outPath)}  ${fmtMB(before)} -> ${fmtMB(after)}  (-${(100 - (after / before) * 100).toFixed(0)}%)`);
}

async function optimizeImages() {
  console.log('\n=== Images (JPG -> WebP) ===');
  const files = await readdir(SRC_IMG);
  const targets = [
    // Gallery + hero photos: max width 1600
    { match: /^[1-7]\.JPG$/i, width: 1600, quality: 78 },
    // Header/footer backgrounds: max width 1920
    { match: /^header2\.JPG$/i, width: 1920, quality: 75 },
    { match: /^footer\.JPG$/i, width: 1920, quality: 75 },
    // Location: max 1200
    { match: /^location\.jpg$/i, width: 1200, quality: 78 },
  ];

  for (const f of files) {
    const cfg = targets.find((t) => t.match.test(f));
    if (!cfg) continue;
    const inPath = path.join(SRC_IMG, f);
    const outName = path.parse(f).name + '.webp';
    const outPath = path.join(SRC_IMG, outName);
    await convertImage(inPath, outPath, cfg);
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    proc.stderr.on('data', (d) => { err += d.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code}: ${err.slice(-500)}`));
    });
  });
}

async function optimizeAudio() {
  console.log('\n=== Audio (mp3 recompress) ===');
  const src = path.join(PUB, 'music.mp3');
  if (!existsSync(src)) { console.log('  music.mp3 not found, skipping'); return; }
  const tmp = path.join(PUB, 'music.opt.mp3');
  const before = await fileSize(src);
  // 96 kbps mono is plenty for a background wedding track on a phone.
  await runFfmpeg(['-y', '-i', src, '-ac', '1', '-b:a', '96k', '-codec:a', 'libmp3lame', tmp]);
  // Replace original
  const { rename } = await import('node:fs/promises');
  await rename(tmp, src);
  const after = await fileSize(src);
  console.log(`  music.mp3  ${fmtMB(before)} -> ${fmtMB(after)}  (-${(100 - (after / before) * 100).toFixed(0)}%)`);
}

async function main() {
  await optimizeImages();
  await optimizeAudio();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
