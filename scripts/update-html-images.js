#!/usr/bin/env node
/**
 * Update index.html with <picture> elements using optimized WebP/AVIF images
 * Reads manifest and replaces <img src="files/..."> with <picture> markup
 */

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const MANIFEST_PATH = path.join(__dirname, 'image-manifest.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
let html = fs.readFileSync(INDEX_PATH, 'utf8');

console.log('🔄 Atualizando index.html com <picture> elements...\n');

let updated = 0;

for (const [originalFile, data] of Object.entries(manifest)) {
  const srcPattern = `src="files/${originalFile}"`;
  
  if (!html.includes(srcPattern)) {
    console.warn(`⚠️  Não encontrado no HTML: ${originalFile}`);
    continue;
  }

  // Build <picture> element
  let picture = `<picture>\n`;
  
  // AVIF sources (if available)
  if (data.avif && data.avif.length > 0) {
    data.avif.forEach((avifPath, i) => {
      const width = data.widths[i];
      picture += `  <source type="image/avif" srcset="${avifPath.replace(/\\/g, '/')} ${width}w" ${width ? `sizes="(max-width: 768px) ${Math.min(width, 360)}px, ${width}px"` : ''}>\n`;
    });
  }
  
  // WebP sources
  data.webp.forEach((webpPath, i) => {
    const width = data.widths[i];
    picture += `  <source type="image/webp" srcset="${webpPath.replace(/\\/g, '/')} ${width}w" ${width ? `sizes="(max-width: 768px) ${Math.min(width, 360)}px, ${width}px"` : ''}>\n`;
  });
  
  // Fallback original
  const alt = data.alt || originalFile.replace(/\.(png|jpg|gif)$/i, '');
  const loading = data.priority === 'high' ? '' : ' loading="lazy"';
  const fetchpriority = data.priority === 'high' ? ' fetchpriority="high"' : '';
  const containClass = data.contain ? ' class="contain"' : '';
  
  picture += `  <img src="files/${originalFile}" alt="${alt}"${loading}${fetchpriority}${containClass}>\n`;
  picture += `</picture>`;

  // Replace the img tag with picture
  // Need to find the full img tag and replace it
  const imgRegex = new RegExp(`<img[^>]*src="files/${originalFile.replace(/\./g, '\\.')}"[^>]*>`, 'g');
  
  const matches = html.match(imgRegex);
  if (matches) {
    matches.forEach(match => {
      html = html.replace(match, picture);
      updated++;
    });
    console.log(`✅ ${originalFile} → <picture> (${matches.length} ocorrência(s))`);
  } else {
    console.warn(`⚠️  Tag img não encontrada para: ${originalFile}`);
  }
}

fs.writeFileSync(INDEX_PATH, html, 'utf8');
console.log(`\n✅ ${updated} imagem(ns) atualizada(s) no index.html`);