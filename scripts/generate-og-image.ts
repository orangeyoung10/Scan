import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function buildPng(width: number, height: number, drawFn: (setPixel: (x: number, y: number, r: number, g: number, b: number, a?: number) => void) => void): Buffer {
  const rawRowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rawRowLen * height);

  const setPixel = (x: number, y: number, r: number, g: number, b: number, a = 255) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const offset = y * rawRowLen + 1 + x * 4;
    // Simple alpha blending if pixel has partial alpha
    if (a < 255) {
      const existingA = rawData[offset + 3] / 255;
      const alpha = a / 255;
      const outA = alpha + existingA * (1 - alpha);
      if (outA > 0) {
        rawData[offset] = Math.round((r * alpha + rawData[offset] * existingA * (1 - alpha)) / outA);
        rawData[offset + 1] = Math.round((g * alpha + rawData[offset + 1] * existingA * (1 - alpha)) / outA);
        rawData[offset + 2] = Math.round((b * alpha + rawData[offset + 2] * existingA * (1 - alpha)) / outA);
        rawData[offset + 3] = Math.round(outA * 255);
      }
    } else {
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
      rawData[offset + 3] = a;
    }
  };

  drawFn(setPixel);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const iend = Buffer.alloc(0);

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', iend)
  ]);
}

// Draw a bold 1200x630 Neo-brutalist OG Banner
const width = 1200;
const height = 630;

const pngBuf = buildPng(width, height, (setPixel) => {
  // 1. Warm light neutral background #F4F5F7
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      setPixel(x, y, 244, 245, 247);
    }
  }

  // 2. Subtle grid pattern in background
  for (let y = 0; y < height; y += 24) {
    for (let x = 0; x < width; x++) {
      setPixel(x, y, 225, 228, 234);
    }
  }
  for (let x = 0; x < width; x += 24) {
    for (let y = 0; y < height; y++) {
      setPixel(x, y, 225, 228, 234);
    }
  }

  // Helper: Draw filled rectangle
  const fillRect = (rx: number, ry: number, rw: number, rh: number, r: number, g: number, b: number) => {
    for (let y = Math.max(0, ry); y < Math.min(height, ry + rh); y++) {
      for (let x = Math.max(0, rx); x < Math.min(width, rx + rw); x++) {
        setPixel(x, y, r, g, b);
      }
    }
  };

  // Helper: Draw border rectangle
  const strokeRect = (rx: number, ry: number, rw: number, rh: number, bw: number, r: number, g: number, b: number) => {
    fillRect(rx, ry, rw, bw, r, g, b);
    fillRect(rx, ry + rh - bw, rw, bw, r, g, b);
    fillRect(rx, ry, bw, rh, r, g, b);
    fillRect(rx + rw - bw, ry, bw, rh, r, g, b);
  };

  // 3. Main Frame Card with hard neo-brutalist shadow
  const cardX = 50;
  const cardY = 50;
  const cardW = 1100;
  const cardH = 530;
  // Shadow (pure black, 12px offset)
  fillRect(cardX + 12, cardY + 12, cardW, cardH, 0, 0, 0);
  // Card Body (pure white)
  fillRect(cardX, cardY, cardW, cardH, 255, 255, 255);
  // Border (6px solid black)
  strokeRect(cardX, cardY, cardW, cardH, 6, 0, 0, 0);

  // 4. Yellow highlight bar at the top of the card
  fillRect(cardX + 6, cardY + 6, cardW - 12, 16, 253, 224, 71); // yellow-300
  fillRect(cardX + 6, cardY + 22, cardW - 12, 3, 0, 0, 0);

  // 5. Draw Right-side Pegboard preview box
  const pegX = 680;
  const pegY = 90;
  const pegW = 430;
  const pegH = 430;

  // Pegboard shadow & white plastic container
  fillRect(pegX + 8, pegY + 8, pegW, pegH, 0, 0, 0);
  fillRect(pegX, pegY, pegW, pegH, 248, 250, 252);
  strokeRect(pegX, pegY, pegW, pegH, 4, 0, 0, 0);

  // Draw 21x21 simulated Perler fuse bead QR code
  const matrixDim = 21;
  const beadPitch = 18;
  const beadRadius = 7.5;
  const startBX = pegX + 26;
  const startBY = pegY + 26;

  // Generate QR-like deterministic pattern with 3 finder patterns
  const isDark = (r: number, c: number): boolean => {
    // Top-left finder
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right finder
    if (r < 7 && c >= matrixDim - 7) {
      const cc = c - (matrixDim - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    // Bottom-left finder
    if (r >= matrixDim - 7 && c < 7) {
      const rr = r - (matrixDim - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Timing pattern
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    // Data hash pseudo-random
    return ((r * 7 + c * 13 + (r ^ c)) % 5) < 2;
  };

  // Draw beads as realistic donut-shaped Perler beads
  for (let r = 0; r < matrixDim; r++) {
    for (let c = 0; c < matrixDim; c++) {
      const cx = startBX + c * beadPitch + 8;
      const cy = startBY + r * beadPitch + 8;
      const dark = isDark(r, c);

      for (let dy = -beadRadius; dy <= beadRadius; dy++) {
        for (let dx = -beadRadius; dx <= beadRadius; dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= beadRadius) {
            const px = Math.round(cx + dx);
            const py = Math.round(cy + dy);
            // Center hole of fuse bead
            if (dist < 2.5) {
              setPixel(px, py, 220, 225, 230); // pegboard peg hole
            } else if (dist >= beadRadius - 1) {
              setPixel(px, py, 20, 20, 20); // outer bead rim
            } else {
              if (dark) {
                // Black bead with slight 3D highlight
                if (dy < -1 && dx < -1) {
                  setPixel(px, py, 75, 85, 99);
                } else {
                  setPixel(px, py, 24, 24, 27);
                }
              } else {
                // White bead
                if (dy < -1 && dx < -1) {
                  setPixel(px, py, 255, 255, 255);
                } else {
                  setPixel(px, py, 235, 238, 242);
                }
              }
            }
          }
        }
      }
    }
  }

  // 6. Draw Left Column Graphic Elements & Typography simulation
  // Pill badge: "100% FREE • LOCAL-FIRST CRAFT TOOL"
  fillRect(90, 100, 320, 32, 239, 68, 68); // Red-500
  fillRect(88, 98, 324, 36, 0, 0, 0);
  fillRect(90, 100, 320, 32, 254, 242, 242);
  // Red dot
  for (let dy = -5; dy <= 5; dy++) {
    for (let dx = -5; dx <= 5; dx++) {
      if (dx * dx + dy * dy <= 25) {
        setPixel(110 + dx, 116 + dy, 239, 68, 68);
      }
    }
  }

  // Brand Name Pill: SCANBEADS.COM
  fillRect(90, 160, 240, 48, 0, 0, 0);
  fillRect(86, 156, 240, 48, 253, 224, 71); // yellow
  strokeRect(86, 156, 240, 48, 3, 0, 0, 0);

  // Large Bold Title Blocks (Simulating Typography)
  fillRect(90, 235, 540, 36, 0, 0, 0); // "PERLER BEAD"
  fillRect(90, 285, 540, 36, 0, 0, 0); // "QR CODE GENERATOR"
  
  // Highlight sub-box: "1:1 PEGBOARD PATTERNS"
  fillRect(90, 345, 480, 28, 239, 68, 68); // red accent bar

  // Feature Checklist Badges
  const drawFeatureBadge = (bx: number, by: number, labelColor: [number, number, number]) => {
    fillRect(bx + 4, by + 4, 250, 40, 0, 0, 0);
    fillRect(bx, by, 250, 40, 255, 255, 255);
    strokeRect(bx, by, 250, 40, 2, 0, 0, 0);
    fillRect(bx + 12, by + 12, 16, 16, labelColor[0], labelColor[1], labelColor[2]);
  };

  drawFeatureBadge(90, 400, [34, 197, 94]); // Green check: Exact Bead Count
  drawFeatureBadge(360, 400, [239, 68, 68]); // Red: Single-Side Melt Sim
  drawFeatureBadge(90, 455, [234, 179, 8]); // Yellow: 1:1 Printable PDF
  drawFeatureBadge(360, 455, [59, 130, 246]); // Blue: Camera Scan Test
});

const outPath = path.resolve(process.cwd(), 'public/og-image.png');
fs.writeFileSync(outPath, pngBuf);
console.log(`[OG-Image] Successfully generated 1200x630 OG image at ${outPath} (${(pngBuf.length / 1024).toFixed(1)} KB)`);
