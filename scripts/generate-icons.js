import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Gradients -->
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E4A6B" />
      <stop offset="50%" stop-color="#0A3650" />
      <stop offset="100%" stop-color="#062233" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2A3" />
      <stop offset="35%" stop-color="#F5C038" />
      <stop offset="70%" stop-color="#E5A823" />
      <stop offset="100%" stop-color="#B87B0E" />
    </linearGradient>

    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#E53935" />
      <stop offset="50%" stop-color="#FB8C00" />
      <stop offset="100%" stop-color="#FFEB3B" />
    </linearGradient>

    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Outer Pentagon Shield (Indonesian School Emblem Crest) -->
  <g filter="url(#shadow)">
    <!-- Shield Outer Gold Border -->
    <path d="M 256,24 
             L 456,86 
             L 416,346 
             C 380,420 310,472 256,494 
             C 202,472 132,420 96,346 
             L 56,86 
             Z" 
          fill="url(#goldGrad)" />

    <!-- Shield Inner Navy Body -->
    <path d="M 256,40 
             L 440,96 
             L 404,338 
             C 370,406 306,454 256,474 
             C 206,454 142,406 108,338 
             L 72,96 
             Z" 
          fill="url(#shieldGrad)" />

    <!-- Inner Gold Ring Border Accent -->
    <path d="M 256,54 
             L 424,106 
             L 392,330 
             C 360,394 300,438 256,456 
             C 212,438 152,394 120,330 
             L 88,106 
             Z" 
          fill="none" 
          stroke="url(#goldGrad)" 
          stroke-width="3" 
          opacity="0.8" />
  </g>

  <!-- Top Arch Banner Text -->
  <text x="256" y="98" fill="#FFFFFF" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="18" letter-spacing="3" text-anchor="middle">
    SMP NEGERI 1 TAMBAK
  </text>

  <!-- Central Star of Excellence -->
  <polygon points="256,120 263,138 282,138 267,149 272,167 256,156 240,167 245,149 230,138 249,138" 
           fill="url(#goldGrad)" />

  <!-- Tut Wuri Handayani Wings Left & Right -->
  <g fill="url(#goldGrad)" stroke="#7A4E04" stroke-width="0.5">
    <!-- Left Wing Feathers -->
    <path d="M 236,240 C 200,220 160,190 132,150 C 142,175 160,205 180,225 C 150,215 130,195 116,170 C 126,198 145,226 172,244 C 142,236 126,220 114,200 C 124,226 142,250 170,264 C 140,260 128,246 120,230 C 130,256 154,276 186,284 C 160,286 146,278 138,266 C 152,288 180,304 218,308 L 236,302 Z" />
    
    <!-- Right Wing Feathers (Mirrored) -->
    <path d="M 276,240 C 312,220 352,190 380,150 C 370,175 352,205 332,225 C 362,215 382,195 396,170 C 386,198 367,226 340,244 C 370,236 386,220 398,200 C 388,226 370,250 342,264 C 372,260 384,246 392,230 C 382,256 358,276 326,284 C 352,286 366,278 374,266 C 360,288 332,304 294,308 L 276,302 Z" />
  </g>

  <!-- Central Torch & Flame (Semangat Belajar) -->
  <g>
    <!-- Outer Glow Flame -->
    <path d="M 256,165 C 274,191 280,213 274,229 C 268,241 256,247 256,247 C 256,247 244,241 238,229 C 232,213 238,191 256,165 Z" 
          fill="url(#flameGrad)" />
    <!-- Inner Flame Core -->
    <path d="M 256,185 C 266,201 270,215 266,225 C 262,233 256,237 256,237 C 256,237 250,233 246,225 C 242,215 246,201 256,185 Z" 
          fill="#FFF9C4" />
    <!-- Torch Handle/Holder -->
    <path d="M 248,243 L 264,243 L 260,273 L 252,273 Z" fill="url(#goldGrad)" stroke="#8A5A0A" stroke-width="1" />
    <ellipse cx="256" cy="243" rx="8" ry="3" fill="#FFE082" />
    <ellipse cx="256" cy="273" rx="5" ry="2" fill="#B87B0E" />
  </g>

  <!-- Open Book of Knowledge (Buku Terbuka Pengetahuan) -->
  <g transform="translate(0, 10)">
    <!-- Book Pages Background Left -->
    <path d="M 256,286 C 228,276 186,276 156,286 L 156,324 C 186,314 228,314 256,326 Z" 
          fill="#FFFFFF" 
          stroke="#0E4A6B" 
          stroke-width="1.5" />
    <!-- Book Pages Background Right -->
    <path d="M 256,286 C 284,276 326,276 356,286 L 356,324 C 326,314 284,314 256,326 Z" 
          fill="#FFFFFF" 
          stroke="#0E4A6B" 
          stroke-width="1.5" />

    <!-- Book Spine -->
    <path d="M 254,285 L 258,285 L 258,332 L 254,332 Z" fill="url(#goldGrad)" />

    <!-- Book Lines Details Left -->
    <line x1="172" y1="295" x2="242" y2="290" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
    <line x1="172" y1="303" x2="242" y2="298" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
    <line x1="172" y1="311" x2="236" y2="306" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />

    <!-- Book Lines Details Right -->
    <line x1="270" y1="290" x2="340" y2="295" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
    <line x1="270" y1="298" x2="340" y2="303" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
    <line x1="276" y1="306" x2="340" y2="311" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
  </g>

  <!-- Golden Banner Ribbon at Bottom: SPENSATA -->
  <g transform="translate(0, 10)">
    <!-- Ribbon Side Folds -->
    <path d="M 148,364 L 126,386 L 148,396 L 148,364 Z" fill="#94610A" />
    <path d="M 364,364 L 386,386 L 364,396 L 364,364 Z" fill="#94610A" />

    <!-- Main Ribbon Plaque -->
    <path d="M 140,354 
             L 372,354 
             C 362,378 360,394 372,400 
             L 140,400 
             C 152,394 150,378 140,354 Z" 
          fill="url(#goldGrad)" 
          stroke="#8A5A0A" 
          stroke-width="1.5" />

    <text x="256" y="384" 
          fill="#0A3550" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-weight="900" 
          font-size="22" 
          letter-spacing="5" 
          text-anchor="middle">
      SPENSATA
    </text>

    <!-- Subtitle: BANYUMAS -->
    <text x="256" y="424" 
          fill="#FFFFFF" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-weight="800" 
          font-size="14" 
          letter-spacing="4" 
          text-anchor="middle">
      BANYUMAS
    </text>
  </g>
</svg>`;

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function renderAndSave(width, height, outputPath) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0, 0, 0, 0)' // Fully transparent background
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Saved ${outputPath} (${width}x${height}, ${pngBuffer.length} bytes)`);
}

// 1. 512x512 favicon.png and logo-sekolah.png
renderAndSave(512, 512, path.join(publicDir, 'favicon.png'));
fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(publicDir, 'logo-sekolah.png'));

// 2. 192x192 favicon-192.png
renderAndSave(192, 192, path.join(publicDir, 'favicon-192.png'));

// 3. 32x32 favicon-32.png
renderAndSave(32, 32, path.join(publicDir, 'favicon-32.png'));

console.log('All icons generated successfully with transparent background!');
