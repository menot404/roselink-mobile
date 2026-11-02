// Génère les icônes de RoseLink (cœur blanc sur dégradé rose) dans assets/images/.
// Usage : node scripts/make-icons.mjs
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = new URL("../assets/images/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// tracé du cœur (24 x 24)
const HEART =
  "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

function svg({ size, background, heart, scale }) {
  const k = (size * scale) / 24;
  const offset = (size - 24 * k) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#E8467C"/><stop offset="1" stop-color="#B02558"/>
  </linearGradient></defs>
  ${background ? `<rect width="${size}" height="${size}" fill="url(#g)"/>` : ""}
  ${scale > 0 ? `<g transform="translate(${offset} ${offset}) scale(${k})"><path d="${HEART}" fill="${heart}"/></g>` : ""}
</svg>`;
}

const FILES = [
  // icône principale
  { name: "icon.png", size: 1024, background: true, heart: "#FFFFFF", scale: 0.56 },
  // Android : le cœur reste dans la zone centrale protégée
  { name: "android-icon-foreground.png", size: 1024, background: false, heart: "#FFFFFF", scale: 0.42 },
  { name: "android-icon-background.png", size: 1024, background: true, heart: "#FFFFFF", scale: 0 },
  // icône monochrome (thèmes d'icônes Android 13+)
  { name: "android-icon-monochrome.png", size: 1024, background: false, heart: "#FFFFFF", scale: 0.42 },
  // écran de démarrage : cœur rose sur fond transparent
  { name: "splash-icon.png", size: 1024, background: false, heart: "url(#g)", scale: 0.6 },
  { name: "favicon.png", size: 48, background: true, heart: "#FFFFFF", scale: 0.6 },
];

for (const file of FILES) {
  await sharp(Buffer.from(svg(file))).png().toFile(new URL(file.name, OUT).pathname);
  console.log("créé :", file.name);
}