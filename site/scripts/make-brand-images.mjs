import sharp from 'sharp';
const logo = 'src/assets/brand/vm23g-logo.png';
const bg = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs><radialGradient id="g" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="#26301d"/><stop offset="0.55" stop-color="#0f1610"/><stop offset="1" stop-color="#060a07"/></radialGradient>
<radialGradient id="h" cx="50%" cy="46%" r="34%"><stop offset="0" stop-color="#c7a45a" stop-opacity="0.22"/><stop offset="1" stop-color="#c7a45a" stop-opacity="0"/></radialGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#h)"/></svg>`);
const og = await sharp(logo).resize({ height: 440 }).toBuffer();
await sharp(bg(1200, 630)).composite([{ input: og, gravity: 'center' }]).jpeg({ quality: 86 }).toFile('public/og-cover.jpg');
for (const [size, file] of [[64, 'public/favicon.png'], [180, 'public/apple-touch-icon.png']]) {
  const h = await sharp(logo).resize({ width: Math.round(size * 0.9) }).toBuffer();
  await sharp(bg(size, size)).composite([{ input: h, gravity: 'center' }]).png().toFile(file);
}
console.log('brand images done');
