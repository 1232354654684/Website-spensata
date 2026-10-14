import os
import subprocess

svg_content = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
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

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Outer Pentagon Shield (Indonesian School Emblem Crest) -->
  <!-- Coordinates calculated for smooth curved pentagon shield -->
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

  <!-- Top Arch Banner: SMP NEGERI 1 TAMBAK -->
  <path id="archTextPath" d="M 104,116 Q 256,76 408,116" fill="none" />
  <text fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="20" letter-spacing="3.5" text-anchor="middle">
    <textPath href="#archTextPath" startOffset="50%" fill="#FFFFFF">
      SMP NEGERI 1 TAMBAK
    </textPath>
  </text>

  <!-- Central Star of Excellence -->
  <polygon points="256,128 263,146 282,146 267,157 272,175 256,164 240,175 245,157 230,146 249,146" 
           fill="url(#goldGrad)" 
           filter="url(#glow)" />

  <!-- Tut Wuri Handayani Wings Left & Right -->
  <g fill="url(#goldGrad)" stroke="#7A4E04" stroke-width="0.5">
    <!-- Left Wing Feathers -->
    <path d="M 236,250 C 200,230 160,200 132,160 C 142,185 160,215 180,235 C 150,225 130,205 116,180 C 126,208 145,236 172,254 C 142,246 126,230 114,210 C 124,236 142,260 170,274 C 140,270 128,256 120,240 C 130,266 154,286 186,294 C 160,296 146,288 138,276 C 152,298 180,314 218,318 L 236,312 Z" />
    
    <!-- Right Wing Feathers (Mirrored) -->
    <path d="M 276,250 C 312,230 352,200 380,160 C 370,185 352,215 332,235 C 362,225 382,205 396,180 C 386,208 367,236 340,254 C 370,246 386,230 398,210 C 388,236 370,260 342,274 C 372,270 384,256 392,240 C 382,266 358,286 326,294 C 352,296 366,288 374,276 C 360,298 332,314 294,318 L 276,312 Z" />
  </g>

  <!-- Central Torch & Flame (Semangat Menuntut Ilmu) -->
  <g>
    <!-- Outer Glow Flame -->
    <path d="M 256,170 C 274,196 280,218 274,234 C 268,246 256,252 256,252 C 256,252 244,246 238,234 C 232,218 238,196 256,170 Z" 
          fill="url(#flameGrad)" 
          filter="url(#glow)" />
    <!-- Inner Flame Core -->
    <path d="M 256,190 C 266,206 270,220 266,230 C 262,238 256,242 256,242 C 256,242 250,238 246,230 C 242,220 246,206 256,190 Z" 
          fill="#FFF9C4" />
    <!-- Torch Handle/Holder -->
    <path d="M 248,248 L 264,248 L 260,278 L 252,278 Z" fill="url(#goldGrad)" stroke="#8A5A0A" stroke-width="1" />
    <ellipse cx="256" cy="248" rx="8" ry="3" fill="#FFE082" />
    <ellipse cx="256" cy="278" rx="5" ry="2" fill="#B87B0E" />
  </g>

  <!-- Open Book of Knowledge (Buku Terbuka Pengetahuan) -->
  <g transform="translate(0, 10)">
    <!-- Book Pages Background Left -->
    <path d="M 256,296 C 228,286 186,286 156,296 L 156,334 C 186,324 228,324 256,336 Z" 
          fill="#FFFFFF" 
          stroke="#0E4A6B" 
          stroke-width="1.5" />
    <!-- Book Pages Background Right -->
    <path d="M 256,296 C 284,286 326,286 356,296 L 356,334 C 326,324 284,324 256,336 Z" 
          fill="#FFFFFF" 
          stroke="#0E4A6B" 
          stroke-width="1.5" />

    <!-- Book Spine & Top Spine Ribbon -->
    <path d="M 254,295 L 258,295 L 258,342 L 254,342 Z" fill="url(#goldGrad)" />

    <!-- Book Lines Details Left -->
    <line x1="172" y1="305" x2="242" y2="300" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <line x1="172" y1="313" x2="242" y2="308" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <line x1="172" y1="321" x2="236" y2="316" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />

    <!-- Book Lines Details Right -->
    <line x1="270" y1="300" x2="340" y2="305" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <line x1="270" y1="308" x2="340" y2="313" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <line x1="276" y1="316" x2="340" y2="321" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
  </g>

  <!-- Golden Banner Ribbon at Bottom: SPENSATA -->
  <g transform="translate(0, 10)">
    <!-- Ribbon Shadow / Fold -->
    <path d="M 148,374 L 126,396 L 148,406 L 148,374 Z" fill="#94610A" />
    <path d="M 364,374 L 386,396 L 364,406 L 364,374 Z" fill="#94610A" />

    <!-- Main Ribbon Plaque -->
    <path d="M 140,364 
             L 372,364 
             C 362,388 360,404 372,410 
             L 140,410 
             C 152,404 150,388 140,364 Z" 
          fill="url(#goldGrad)" 
          stroke="#8A5A0A" 
          stroke-width="1.5" />

    <text x="256" y="394" 
          fill="#0A3550" 
          font-family="'Plus Jakarta Sans', Arial, sans-serif" 
          font-weight="900" 
          font-size="23" 
          letter-spacing="5" 
          text-anchor="middle">
      SPENSATA
    </text>

    <!-- Subtitle: BANYUMAS -->
    <text x="256" y="434" 
          fill="#FFFFFF" 
          font-family="'Plus Jakarta Sans', Arial, sans-serif" 
          font-weight="800" 
          font-size="14" 
          letter-spacing="4.5" 
          text-anchor="middle">
      BANYUMAS
    </text>
  </g>
</svg>
"""

os.makedirs('/app/applet/public', exist_ok=True)
with open('/tmp/logo-sekolah.svg', 'w') as f:
    f.write(svg_content.strip())

# Convert to 512x512 transparent PNG
subprocess.run(['convert', '-background', 'none', '-size', '512x512', '/tmp/logo-sekolah.svg', '/app/applet/public/favicon.png'], check=True)
subprocess.run(['cp', '/app/applet/public/favicon.png', '/app/applet/public/logo-sekolah.png'], check=True)

# Also generate 192x192 and 32x32 for mobile & crisp browser tab display
subprocess.run(['convert', '-background', 'none', '-size', '192x192', '/tmp/logo-sekolah.svg', '/app/applet/public/favicon-192.png'], check=True)
subprocess.run(['convert', '-background', 'none', '-size', '32x32', '/tmp/logo-sekolah.svg', '/app/applet/public/favicon-32.png'], check=True)

print("Icons successfully created!")
