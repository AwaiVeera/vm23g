import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'src/assets');
const outDir = path.join(root, 'public/media');

const plans = {
  brand: [480, 760, 1280],
  founders: [480, 800, 1200],
  work: [480, 800, 1200],
  press: [480, 800, 1200],
};

const manifest = {};

async function newer(src, out) {
  try {
    const [a, b] = await Promise.all([stat(src), stat(out)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

for (const [folder, widths] of Object.entries(plans)) {
  const dir = path.join(srcDir, folder);
  const files = (await readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  await mkdir(path.join(outDir, folder), { recursive: true });
  for (const file of files) {
    const name = file.replace(/\.(png|jpe?g)$/i, '');
    const input = path.join(dir, file);
    const meta = await sharp(input).metadata();
    const usable = widths.filter((w) => w <= meta.width);
    if (!usable.includes(meta.width) && usable.length < widths.length) usable.push(meta.width);
    const sizes = [...new Set(usable)].sort((a, b) => a - b);
    const variants = [];
    for (const w of sizes) {
      for (const format of ['avif', 'webp']) {
        const out = path.join(outDir, folder, `${name}-${w}.${format}`);
        if (!(await newer(input, out))) {
          const pipeline = sharp(input).resize({ width: w, withoutEnlargement: true });
          if (format === 'avif') await pipeline.avif({ quality: folder === 'brand' ? 70 : 55, effort: 6 }).toFile(out);
          else await pipeline.webp({ quality: folder === 'brand' ? 90 : 78, alphaQuality: 100 }).toFile(out);
        }
      }
      variants.push(w);
    }
    manifest[`${folder}/${name}`] = {
      width: meta.width,
      height: meta.height,
      widths: variants,
      alpha: Boolean(meta.hasAlpha),
    };
  }
}

await writeFile(path.join(root, 'src/content/media-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`optimized ${Object.keys(manifest).length} images`);
