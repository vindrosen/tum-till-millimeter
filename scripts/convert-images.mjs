/**
 * Konverterar genererade PNG-original i assets/generated/ till 512×512
 * WebP i public/images/ (samma format som sajtens befintliga bilder).
 * Kör: node scripts/convert-images.mjs [filnamn-utan-ändelse ...]
 * Utan argument konverteras alla PNG:er som saknar WebP-motsvarighet.
 */
import sharp from "sharp";
import { readdirSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

const SRC = "assets/generated";
const OUT = "public/images";

const requested = process.argv.slice(2);
const names = requested.length
  ? requested
  : readdirSync(SRC)
      .filter((f) => f.endsWith(".png") && f !== "logo-cube.png")
      .map((f) => basename(f, ".png"))
      .filter((n) => !existsSync(join(OUT, `${n}.webp`)));

for (const name of names) {
  const src = join(SRC, `${name}.png`);
  const out = join(OUT, `${name}.webp`);
  await sharp(src).resize(512, 512, { fit: "inside" }).webp({ quality: 80 }).toFile(out);
  console.log(`${src} → ${out}`);
}
console.log(`${names.length} bilder konverterade.`);
