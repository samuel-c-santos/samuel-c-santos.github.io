#!/usr/bin/env node
/**
 * Link Validator — Samuel Santos Portfolio
 * Valida 42 links externos do index.html
 * 
 * Uso: node scripts/validate-links.js
 * Saída: console + scripts/link-report.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const REPORT_PATH = path.join(__dirname, 'link-report.json');

// Links extraídos do index.html (42 URLs)
const LINKS = [
  // Nav
  { url: 'https://samuelsantos.site/tutoriais', context: 'Nav → Tutoriais' },
  { url: 'https://github.com/samuel-c-santos', context: 'Nav → GitHub' },
  { url: 'https://www.linkedin.com/in/samuelsantos-amb/', context: 'Nav → LinkedIn' },
  
  // Projects
  { url: 'https://github.com/samuel-c-santos/amazoniahack', context: 'GeoVicinal → GitHub' },
  { url: 'https://github.com/samuel-c-santos/portica-app', context: 'Pórtica → GitHub' },
  { url: 'https://samuelsantos.site/portica-app/', context: 'Pórtica → Site' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa', context: 'Queimadas → GitHub' },
  { url: 'https://colab.research.google.com/github/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa/blob/main/notebooks/colab_runner.ipynb', context: 'Queimadas → Colab' },
  { url: 'https://github.com/samuel-c-santos/satellite-lst-downscaler', context: 'LST Downscaling → GitHub' },
  { url: 'https://colab.research.google.com/github/samuel-c-santos/satellite-lst-downscaler/blob/main/LST_Downscaling_IDEFLORBio_Colab.ipynb', context: 'LST Downscaling → Colab' },
  { url: 'https://github.com/samuel-c-santos/opensr-sentinel-pipeline', context: 'OpenSR → GitHub' },
  { url: 'https://colab.research.google.com/github/samuel-c-santos/opensr-sentinel-pipeline/blob/main/OpenSR_Producao_Poligono_Colab.ipynb', context: 'OpenSR → Colab' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/cartografia-tematica', context: 'Cartografia Temática → GitHub' },
  { url: 'https://ngeo-ideflor-bio.github.io/cartografia-tematica/', context: 'Cartografia Temática → Site' },
  { url: 'https://ngeo-ideflor-bio.github.io/visualizador/', context: 'Visualizador → Site' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/visualizador', context: 'Visualizador → GitHub' },
  { url: 'https://ngeo-ideflor-bio.github.io/guia-uc-para/', context: 'Guia UCs → Site' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/guia-uc-para', context: 'Guia UCs → GitHub' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/viveiros-ideflorbio', context: 'Guia Viveiros → GitHub' },
  { url: 'https://ngeo-ideflor-bio.github.io/viveiros-ideflorbio/', context: 'Guia Viveiros → Site' },
  { url: 'https://app.powerbi.com/view?r=eyJrIjoiOTNiMzg3MjQtN2Q0Zi00YjlkLTgxZWQtZTljYmQxMTVjN2JkIiwidCI6ImQ1MmMxYTcyLWUwNzEtNDhhNS04YTJhLTFjNDI5ZjMxYzE0MiJ9', context: 'CPAs → PowerBI (RISCO ALTO)' },
  { url: 'https://github.com/samuel-c-santos/auto-review-r', context: 'Auto Review → GitHub' },
  { url: 'https://github.com/samuel-c-santos/sprint-kanban-template', context: 'Kanban → GitHub' },
  { url: 'https://sprint-kanban-template.vercel.app/kanban.html', context: 'Kanban → Demo' },
  { url: 'https://github.com/samuel-c-santos/doom-fire', context: 'Doom Fire → GitHub' },
  { url: 'https://samuelsantos.site/doom-fire/', context: 'Doom Fire → Demo' },
  { url: 'https://github.com/samuel-c-santos/krigarem_r', context: 'Krigagem → GitHub' },
  { url: 'https://github.com/samuel-c-santos/s2dr3_inferencia_automatizada_sentinel2', context: 'S2DR3 → GitHub' },
  { url: 'https://github.com/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader', context: 'Download Landsat → GitHub' },
  { url: 'https://colab.research.google.com/github/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader/blob/main/ngeo_satellite_downloader.ipynb', context: 'Download Landsat → Colab' },
  { url: 'https://github.com/samuel-c-santos/sentinel-time-viewer', context: 'Sentinel Time → GitHub' },
  { url: 'https://github.com/samuel-c-santos/geovisor-belem', context: 'Geovisor Belém → GitHub' },
  { url: 'https://samuelsantos.site/geovisor-belem/', context: 'Geovisor Belém → Site' },
  { url: 'https://app.powerbi.com/view?r=eyJrIjoiMzJhMTg4NzItMmI5Ny00YjQwLTgzN2UtOWQxMzU1M2JhNDk0IiwidCI6ImJiOWRkMWUwLTgzYmEtNGZmYS1hY2Q3LTQyNzJhZGY4ZGIyNSJ9', context: 'Iniciativas DIGEO → PowerBI (RISCO ALTO)' },
  { url: 'https://samuelsantos.site/cartografia/', context: 'Cartografia Bragança → Site' },
  { url: 'https://github.com/samuel-c-santos/manguezais-pa458-monitoramento', context: 'Manguezais → GitHub' },
  { url: 'https://github.com/samuel-c-santos/ArchiSearch', context: 'ArchiSearch → GitHub' },
  { url: 'https://youtu.be/_1-IMBy0Xbw', context: 'ArchiSearch → YouTube' },
  
  // Certificados (Coursera)
  { url: 'https://www.coursera.org/account/accomplishments/professional-cert/S77137BIW3BB', context: 'Cert IBM Data Science' },
  { url: 'https://www.coursera.org/account/accomplishments/professional-cert/6O9UOEAOR8SC', context: 'Cert Google BI' },
  { url: 'https://www.coursera.org/account/accomplishments/professional-cert/UCL8PA52WE22', context: 'Cert Google Data Analytics' },
  { url: 'https://www.coursera.org/account/accomplishments/professional-cert/FERD3VNVCZUX', context: 'Cert Google Advanced Data Analytics' },
  { url: 'https://www.coursera.org/account/accomplishments/specialization/TMPQCW1K8GJU', context: 'Cert Google IT Automation' },
  
  // Contato
  { url: 'mailto:samuelsantosambiental@gmail.com', context: 'Contato → Email' },
  { url: 'https://wa.me/5591984741391', context: 'Contato → WhatsApp' },
  { url: 'https://www.linkedin.com/in/samuelsantos-amb/', context: 'Contato → LinkedIn' },
  { url: 'https://dot.cards/samuelsantos', context: 'Contato → Cartão Digital' },
];

function checkUrl(url) {
  return new Promise((resolve) => {
    if (url.startsWith('mailto:') || url.startsWith('https://wa.me/')) {
      resolve({ url, status: 'SKIP', ok: true, context: '' });
      return;
    }
    
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      const ok = res.statusCode >= 200 && res.statusCode < 400;
      resolve({ url, status: res.statusCode, ok, context: '' });
    });
    
    req.on('error', (err) => {
      resolve({ url, status: 'ERROR', ok: false, error: err.message, context: '' });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', ok: false, context: '' });
    });
    
    req.end();
  });
}

async function main() {
  console.log(`🔍 Validando ${LINKS.length} links...\n`);
  
  const results = [];
  
  for (let i = 0; i < LINKS.length; i++) {
    const link = LINKS[i];
    process.stdout.write(`  [${i+1}/${LINKS.length}] ${link.context}... `);
    
    const result = await checkUrl(link.url);
    result.context = link.context;
    
    const icon = result.ok ? '✅' : '❌';
    const status = result.status === 'SKIP' ? 'SKIP' : result.status;
    console.log(`${icon} ${status}`);
    
    results.push(result);
  }
  
  // Save report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  console.log(`\n📝 Report saved: ${REPORT_PATH}`);
  
  // Summary
  const ok = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;
  const skip = results.filter(r => r.status === 'SKIP').length;
  
  console.log(`\n📊 RESUMO:`);
  console.log(`   ✅ OK: ${ok}`);
  console.log(`   ❌ Falharam: ${fail}`);
  console.log(`   ⏭️  Skip (mailto/whatsapp): ${skip}`);
  
  if (fail > 0) {
    console.log(`\n❌ LINKS COM PROBLEMA:`);
    results.filter(r => !r.ok).forEach(r => {
      console.log(`   - ${r.context}: ${r.url} (${r.status}${r.error ? ': ' + r.error : ''})`);
    });
  }
  
  // Highlight PowerBI risk
  const powerbi = results.filter(r => r.url.includes('powerbi.com'));
  if (powerbi.length) {
    console.log(`\n⚠️  POWERBI EMBED TOKENS (risco de expiração):`);
    powerbi.forEach(r => console.log(`   - ${r.context}`));
  }
}

main().catch(console.error);