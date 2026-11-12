#!/usr/bin/env node
/**
 * Download IBM Plex Sans woff2 (self-host)
 * Substitui: Antonio (600,700) + Karla (400,500,700) + Google Fonts CDN
 * 
 * Weights needed: 400, 500, 600, 700
 * Subsets: latin, latin-ext (PT-BR)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'fonts');
const WEIGHTS = [400, 500, 600, 700];

// IBM Plex Sans woff2 URLs (Google Fonts API)
const BASE_URL = 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2';

// Actually, let's use the proper Google Fonts URLs for each weight
const FONT_URLS = {
  400: 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2', // Regular
  500: 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2', // Medium (same file, different axis)
  600: 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2', // SemiBold
  700: 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2', // Bold
};

// Actually IBM Plex Sans is a variable font! Let's download the variable font.
const VARIABLE_FONT_URL = 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKjQ.woff2';

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('📥 Downloading IBM Plex Sans Variable Font (woff2)...');
  
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  const dest = path.join(FONTS_DIR, 'IBMPlexSans-Variable.woff2');
  
  try {
    await downloadFile(VARIABLE_FONT_URL, dest);
    const stats = fs.statSync(dest);
    console.log(`✅ Downloaded: ${dest} (${(stats.size/1024).toFixed(1)} KB)`);
    
    // Generate @font-face CSS
    const css = `/* IBM Plex Sans Variable — Self-hosted, font-display: swap */
@font-face {
  font-family: 'IBM Plex Sans';
  src: url('../fonts/IBMPlexSans-Variable.woff2') format('woff2-variations');
  font-weight: 100 700;
  font-stretch: 85% 100%;
  font-display: swap;
  font-style: normal;
}

/* Fallback para browsers sem suporte a variable fonts */
@font-face {
  font-family: 'IBM Plex Sans';
  src: url('../fonts/IBMPlexSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: 'IBM Plex Sans';
  src: url('../fonts/IBMPlexSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: 'IBM Plex Sans';
  src: url('../fonts/IBMPlexSans-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: 'IBM Plex Sans';
  src: url('../fonts/IBMPlexSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
  font-style: normal;
}`;

    fs.writeFileSync(path.join(FONTS_DIR, 'ibm-plex-sans.css'), css);
    console.log(`✅ CSS generated: ${path.join(FONTS_DIR, 'ibm-plex-sans.css')}`);
    
    console.log('\n📋 Próximos passos:');
    console.log('1. Adicionar <link rel="preload" as="font" type="font/woff2" crossorigin href="fonts/IBMPlexSans-Variable.woff2"> no <head>');
    console.log('2. Substituir Google Fonts link pelo CSS local: <link rel="stylesheet" href="fonts/ibm-plex-sans.css">');
    console.log('3. Atualizar tokens CSS: --aipim-font-heading: "IBM Plex Sans", ...; --aipim-font-body: "IBM Plex Sans", ...');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.log('\n⚠️  Download falhou. Baixe manualmente de:');
    console.log('   https://fonts.google.com/specimen/IBM+Plex+Sans');
    console.log('   Selecione: Variable font (woff2) + weights 400,500,600,700');
  }
}

main();