# yuzu-landing

Dựng lại UI của `https://yuzu-landing-test.vercel.app` bằng **Vite + React + TypeScript + Tailwind v4**.
Toàn bộ design token (màu light/dark, font, spacing) và class layout được trích **trực tiếp từ DOM/CSS của trang gốc**, không đoán.

## Chạy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build production
npm run preview
```

## Tải asset về local (nên làm ngay)

Ảnh/logo hiện đang trỏ về domain gốc để trang lên đúng ngay từ lần chạy đầu.
Tải về `public/assets` rồi trỏ nội bộ:

```bash
npm run fetch-assets
echo "VITE_ASSET_BASE=" > .env.local
npm run dev
```

## Cấu trúc

```
src/
  index.css                  ← DESIGN TOKENS (sửa màu/font ở đây là đổi cả trang)
  data/content.ts            ← toàn bộ text + số liệu + danh sách partner (verbatim từ trang gốc)
  lib/utils.ts               ← cn(), splitLinks()
  components/
    ui/
      Icons.tsx              ← icon set (arrow, chevron, lock/exit/shield, transparency…)
      Wordmark.tsx           ← logo Yuzu (inline SVG, có prop mono cho footer)
      ThemeToggle.tsx        ← light/dark, lưu localStorage
      OrbitVisual.tsx        ← hero: quả yuzu + 2 vòng orbit + pill nhãn
      StatBox.tsx            ← 4 thẻ số liệu + sóng "nước" + tooltip breakdown khi hover
      CitrusChart.tsx        ← biểu đồ múi cam của Products (tự sinh, có leader line + chống đè nhãn)
      SecurityVisuals.tsx    ← minh hoạ tranche / radar / MPC wallet
    sections/
      Header.tsx  Hero.tsx  Partners.tsx  Products.tsx
      Security.tsx  Transparency.tsx  Contact.tsx  Faq.tsx  Footer.tsx
  App.tsx                    ← thứ tự section
```

## Design tokens

`src/index.css` chứa đúng bộ biến của trang gốc:

| | light | dark |
|---|---|---|
| background | `#f3f6f0` | `#0a120c` |
| foreground | `#14211a` | `#eef5ec` |
| surface | `#fcfdfa` | `#101a12` |
| accent / citrus | `#3e7b18` | `#9fe870` |
| prime | `#93690b` | `#edc15f` |
| marketplace | `#4a4fb5` | `#a8adff` |
| line-solid | `#dbe4d5` | `#1f2e23` |
| muted-foreground | `#5c6e60` | `#9db3a0` |

Có sẵn 2 scope màu theo sản phẩm: `.prime-scope`, `.mkt-scope` (Products đổi màu theo tab).

## Font

Trang gốc self-host qua `next/font`; ở đây dùng Google Fonts cho nhanh:

- **Bricolage Grotesque** → heading (`--font-display`)
- **Instrument Sans** → body (`--font-sans`, 16px/1.5)
- **Geist Mono** → số liệu & microlabel (`--font-mono`, class `.data` / `.microlabel` / `.kicker`)

Muốn self-host: tải `.woff2` vào `public/fonts` rồi khai báo `@font-face` trong `index.css`, xoá `<link>` Google Fonts trong `index.html`.

## Đo được từ trang gốc (để đối chiếu khi sửa)

- header: `h-16`, container `max-w-[1320px] px-6 lg:px-[60px]`
- hero container: `max-w-[1160px]`, grid `lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] gap-10 lg:gap-14`
- h1: `text-[32px] sm:text-[40px] lg:text-[50px]`, weight 600, `leading-[1.06]`, `tracking-[-0.015em]`
- body: 15px / `leading-[1.65]`
- section padding: `px-6 py-16 lg:px-[60px] lg:py-20`
- Products: `h-[300svh]` + panel `sticky top-16` (3 bước theo scroll)
- Security: 5 panel `sticky top-16 h-[480px]`, nền so le `--background` / `--surface-2`, số thứ tự `text-[240px]` màu `--mark` / `--mark-2`
- radius: card `rounded-lg` (16px), control `rounded-sm` (8px)

## Khác biệt so với trang gốc (chủ ý, cần biết khi sửa)

1. **Hero orbit** — trang gốc dùng animation phức tạp (nhiều lớp SVG + framer-motion). Ở đây dựng lại bằng SVG + CSS keyframes: giống về bố cục/tỉ lệ, chuyển động đơn giản hơn và dễ sửa.
2. **Biểu đồ Products** — tự sinh từ mảng `slices` trong `content.ts` (đổi số là đổi hình), không phải copy path.
3. **Minh hoạ Security** (radar, tranche, MPC wallet) — vẽ lại bằng SVG. Muốn giống 100% thì thay bằng ảnh gốc trong `public/assets/landing`.
4. **Smooth scroll** — trang gốc dùng Lenis; đây dùng `scroll-behavior: smooth` native. Cần Lenis thì `npm i lenis` rồi khởi tạo trong `main.tsx`.
5. **Accordion/Dropdown** — trang gốc dùng Radix UI; đây tự implement để bớt dependency. Muốn Radix: `npm i @radix-ui/react-accordion`.
6. **Số liệu** là snapshot lúc trích (TVL $78.97M, yield $2.94M, ratio 108.66% / 100.05%) — trang gốc đọc live từ API. Sửa trong `content.ts` hoặc nối API sau.

## Sửa UI ở đâu

| Muốn đổi | Sửa file |
|---|---|
| Màu, font, radius | `src/index.css` (khối `:root` / `.dark`) |
| Chữ, số, danh sách partner, FAQ | `src/data/content.ts` |
| Bố cục 1 section | `src/components/sections/<Tên>.tsx` |
| Thứ tự section | `src/App.tsx` |
| Biểu đồ tròn | `src/components/ui/CitrusChart.tsx` |
