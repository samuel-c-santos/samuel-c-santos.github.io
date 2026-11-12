#!/usr/bin/env node
/**
 * Image Optimization Pipeline — Samuel Santos Portfolio
 * 
 * P1 Tasks:
 * 1. Remove 12 orphan files from files/
 * 2. Convert 24 project screenshots to WebP (75%) + AVIF fallback
 * 3. Hero: WebP/AVIF 400w + 280w (mobile) + fetchpriority=high
 * 4. Certificates: WebP lossless 80x80
 * 5. GIFs: WebP animated or MP4
 * 6. OG image: WebP 1200x630 < 100KB
 * 7. Generate <picture> markup with srcset + width/height
 * 
 * Requires: sharp (npm install sharp)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = 'H:\\Meu Drive\\DEV\\Portfólio GitHub\\samuel-c-santos.github.io';
const FILES_DIR = path.join(ROOT, 'files');
const OPTIMIZED_DIR = path.join(ROOT, 'images', 'optimized');
const MANIFEST_PATH = path.join(ROOT, 'scripts', 'image-manifest.json');

// ============================================================
// 1. ORPHAN FILES TO REMOVE (12 files = ~8.6 MB)
const ORPHANS = [
  'Perfil_old.png',                    // 2.15 MB
  'AH4.0_certificates(3).png',         // 2.04 MB
  'krigagem-solo-r-showcase.jpg',      // 1.31 MB (duplicate of PNG)
  'Perfil3.png',                       // 987 KB
  'linkedin_cover.png',                // 97 KB
  'linkedin_cover2.png',               // 95 KB
  'visualizador-filtro.png',           // 366 KB
  'visualizador-zoneamento.png',       // 401 KB
  'visualizador-mobile.png',           // 174 KB
  'globe.svg',                         // 3.6 KB
  'perfil.jpeg',                       // 19 KB
  'card-cartografia-temp.html',        // 1.6 KB
];

// ============================================================
// 2. FILES USED IN HTML (29 files) — need optimization
const USED_IN_HTML = [
  // Hero (above-fold) — PRIORITY MAX
  { src: 'Perfil2.png', widths: [400, 280], quality: 80, priority: 'high', alt: 'hero' },

  // About section
  { src: 'samuel_presentation.png', widths: [500], quality: 75, alt: 'about' },

  // Project cards (24 cards) — lazy loaded
  { src: 'geovicinal-capa.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'portica-tela-inicial.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'cartografia-queimadas-ucs-pa.jpg', widths: [360], quality: 75, alt: 'project' },
  { src: 'lst-downscale-comparison.png', widths: [360], quality: 75, alt: 'project', contain: true },
  { src: 'opensr-comparativo.png', widths: [360], quality: 75, alt: 'project', contain: true },
  { src: 'cartografia-tematica-thumb.jpg', widths: [360], quality: 75, alt: 'project' },
  { src: 'visualizador-inicial.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'guia-uc.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'guia-viveiros.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'dash_cpa.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'auto-review-top-journals.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'kanban-board-inicial.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'doom-fire-comparison.gif', widths: [360], quality: 75, alt: 'project', animated: true },
  { src: 'krigagem-solo-r-showcase.png', widths: [360], quality: 75, alt: 'project', contain: true },
  { src: 's2dr3-demonstracao.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'download-landsat-sentinel-demo.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'sentinel-time-viewer-swipe.gif', widths: [360], quality: 75, alt: 'project', animated: true },
  { src: 'geovisor-belem-screenshot.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'dashboard-iniciativas.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'cartografia-mapa-braganca.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'manguezais-bfastmonitor.png', widths: [360], quality: 75, alt: 'project' },
  { src: 'archisearch-img-cabana.png', widths: [360], quality: 75, alt: 'project' },

  // Certificates (5) — lossless, 80x80 fixed
  { src: 'ibm_data_science.png', widths: [80], quality: 100, lossless: true, alt: 'cert' },
  { src: 'google_business_intelligence.png', widths: [80], quality: 100, lossless: true, alt: 'cert' },
  { src: 'google_data_analytics.png', widths: [80], quality: 100, lossless: true, alt: 'cert' },
  { src: 'google_advanced_data_analytics.png', widths: [80], quality: 100, lossless: true, alt: 'cert' },
  { src: 'google_it_automation_python.png', widths: [80], quality: 100, lossless: true, alt: 'cert' },

  // OG Image (meta tags)
  { src: 'samuel-santos-thumbnail.png', widths: [1200], quality: 80, alt: 'og' },

  // README reference
  { src: 'mockup.png', widths: [800], quality: 75, alt: 'readme' },
];

// ============================================================
// HELPERS
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getOutName(src, width, ext) {
  const base = path.basename(src, path.extname(src));
  return `${base}-${width}w.${ext}`;
}

async function optimizeImage({ src, widths, quality, lossless = false, contain = false, animated = false, alt }) {
  const inputPath = path.join(FILES_DIR, src);
  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️  Missing: ${src}`);
    return null;
  }

  const stats = fs.statSync(inputPath);
  const originalSize = stats.size;

  // For animated GIFs → WebP animated
  if (animated && (src.endsWith('.gif') || src.endsWith('.GIF'))) {
    const webpOut = path.join(OPTIMIZED_DIR, getOutName(src, widths[0], 'webp'));
    await sharp(inputPath, { animated: true })
      .webp({ quality, lossless: false })
      .toFile(webpOut);
    
    const webpStats = fs.statSync(webpOut);
    console.log(`✅ ${src} (${(originalSize/1024).toFixed(0)}KB) → WebP animated ${widths[0]}w (${(webpStats.size/1024).toFixed(0)}KB) -${((1-webpStats.size/originalSize)*100).toFixed(0)}%`);
    return { webp: [webpOut], avif: [] };
  }

  const results = { webp: [], avif: [] };

  for (const w of widths) {
    // WebP
    const webpOut = path.join(OPTIMIZED_DIR, getOutName(src, w, 'webp'));
    let pipeline = sharp(inputPath).resize(w, null, { 
      withoutEnlargement: true,
      fit: contain ? 'contain' : 'cover',
      background: contain ? { r: 250, g: 250, b: 250, alpha: 1 } : undefined
    });
    
    if (lossless) {
      pipeline = pipeline.webp({ lossless: true, effort: 6 });
    } else {
      pipeline = pipeline.webp({ quality, effort: 4 });
    }
    await pipeline.toFile(webpOut);
    results.webp.push(webpOut);

    // AVIF (smaller, modern browsers)
    const avifOut = path.join(OPTIMIZED_DIR, getOutName(src, w, 'avif'));
    pipeline = sharp(inputPath).resize(w, null, { 
      withoutEnlargement: true,
      fit: contain ? 'contain' : 'cover',
      background: contain ? { r: 250, g: 250, b: 250, alpha: 1 } : undefined
    });
    await pipeline.avif({ quality: quality - 5, effort: 4 }).toFile(avifOut);
    results.avif.push(avifOut);
  }

  const webpSize = fs.statSync(results.webp[0]).size;
  console.log(`✅ ${src} (${(originalSize/1024).toFixed(0)}KB) → WebP ${widths.join('/')}w (${(webpSize/1024).toFixed(0)}KB) -${((1-webpSize/originalSize)*100).toFixed(0)}%`);
  return results;
}

// ============================================================
// MAIN
async function main() {
  console.log('🚀 Starting image optimization pipeline...\n');

  ensureDir(OPTIMIZED_DIR);

  // 1. Remove orphans
  console.log('🗑️  Removing orphan files...');
  for (const orphan of ORPHANS) {
    const p = path.join(FILES_DIR, orphan);
    if (fs.existsSync(p)) {
      const size = fs.statSync(p).size;
      fs.unlinkSync(p);
      console.log(`  🗑️  Removed: ${orphan} (${(size/1024/1024).toFixed(2)} MB)`);
    }
  }

  // 2. Optimize used images
  console.log('\n🖼️  Optimizing used images...');
  const manifest = {};
  
  for (const item of USED_IN_HTML) {
    const result = await optimizeImage(item);
    if (result) {
      manifest[item.src] = {
        original: item.src,
        widths: item.widths,
        webp: result.webp.map(p => path.relative(ROOT, p)),
        avif: result.avif.map(p => path.relative(ROOT, p)),
        contain: item.contain || false,
        animated: item.animated || false,
        priority: item.priority || 'lazy',
        alt: item.alt
      };
    }
  }

  // 3. Save manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n📝 Manifest saved: ${MANIFEST_PATH}`);

  // 4. Summary
  const totalOriginal = USED_IN_HTML.reduce((sum, item) => {
    const p = path.join(FILES_DIR, item.src);
    return sum + (fs.existsSync(p) ? fs.statSync(p).size : 0);
  }, 0);

  const totalOptimized = Object.values(manifest).reduce((sum, m) => {
    return sum + m.webp.reduce((s, w) => s + fs.statSync(path.join(ROOT, w)).size, 0);
  }, 0);

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Original total: ${(totalOriginal/1024/1024).toFixed(2)} MB`);
  console.log(`   Optimized (WebP): ${(totalOptimized/1024/1024).toFixed(2)} MB`);
  console.log(`   Savings: ${((1-totalOptimized/totalOriginal)*100).toFixed(0)}%`);
  console.log(`\n✅ Done! Next: update index.html with <picture> markup from manifest.`);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});