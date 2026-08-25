/**
 * Tải toàn bộ ảnh/logo từ trang gốc về ./public/assets để project chạy offline
 * và không phụ thuộc domain ngoài.
 *
 *   node scripts/fetch-assets.mjs
 *   (hoặc: npm run fetch-assets)
 *
 * Sau khi tải xong, đặt VITE_ASSET_BASE= (rỗng) trong .env.local — hoặc bỏ luôn
 * vì mặc định đã ưu tiên file local nếu tồn tại.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";

const BASE = process.env.ASSET_BASE ?? "https://yuzu-landing-test.vercel.app";
const OUT = "public";

const files = [
  "/assets/yuzu-wordmark.svg",
  "/assets/tokens/yzPrime.svg",
  "/assets/tokens/yzCash.svg",
  "/assets/tokens/yzSyrup.svg",
  "/assets/landing/radaz.png",
  "/assets/landing/noise.png",
  "/assets/tokens/syzUSD.svg",
  "/assets/tokens/yzPP.svg",
  ...["ethereum.png","monad.png","plasma.svg","sei.png","pharos.png","hyperliquid.png","berachain.png","base.png","arbitrum.svg","bnbchain.png","solana.png","sui.png","ink.svg","robinhood.png","euler.png","pendle.png","curve.png","spark.png","sky.png","gearbox.png","dolomite.png","curvance.png","kamino.png","jupiter.png","cap.svg","securitize.png","superstate.png","openeden.svg","centrifuge.png","wisdomtree.png","midas.png","fasanara.png","theo.png","agora.png","m0.png","globaldollar.png","paypal.png","ripple.png","wlfi.png","fordefi.png","hypernative.png","redstone.png","chainlink.png","layerzero.png","accountable.svg"].map((f) => `/assets/partners/${f}`),
  ...["maple.png","aave.png","morpho.png","ethena.png","fluid.png","strata.png","pashov.png","dedaub.png"].map((f) => `/assets/security/${f}`),
];

let ok = 0;
let fail = 0;

for (const path of files) {
  const dest = join(OUT, path);
  try {
    await access(dest);
    ok++;
    continue;
  } catch {
    /* chưa có -> tải */
  }
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    ok++;
    process.stdout.write(".");
  } catch (e) {
    fail++;
    console.warn(`\n  ✗ ${path} — ${e.message}`);
  }
}

console.log(`\nXong: ${ok} file, lỗi ${fail}.`);
console.log('Giờ tạo file .env.local với dòng:  VITE_ASSET_BASE=');
