# Yuzu landing — extracted design system (from live site, viewport 1200, DPR2)

## Fonts (next/font, self-hosted)
- Display/headings: **Bricolage Grotesque** (variable) — `font-display`
- Body/UI: **Instrument Sans** — `font-sans` (body default, 16px/24px)
- Mono/numerals/labels: **Geist Mono** — `font-mono`
- Smooth scroll: **Lenis** (html.lenis)
- Accordions/dropdowns: **Radix UI**
- html class carries `light` / `dark`

## Layout
- header: `sticky top-0 z-50 border-b border-line-solid bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-[14px]`
- header inner nav: `mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 lg:px-[60px]`
- hero container: `mx-auto w-full max-w-[1160px]`, grid `grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_...]`
- h1: `text-[32px] font-semibold leading-[1.06]` → at lg renders 50px/53px, letter-spacing -0.75px (i.e. `lg:text-[50px] tracking-[-0.015em]`)
- hero body p: 15px / 24.75px (leading-[1.65]) color var(--muted-foreground)

## Light tokens (:root)
--background:#f3f6f0; --foreground:#14211a; --surface:#fcfdfa; --surface-2:#e8eee3;
--card:#fcfdfa; --card-foreground:#14211a; --popover:#fcfdfa;
--line:#dbe4d580; --line-solid:#dbe4d5; --line-strong:#c2d0ba; --border:#dbe4d5; --input:#dbe4d5; --border-prominent:#c2d0ba;
--muted:#e8eee3; --muted-foreground:#5c6e60; --faint:#617565; --text-neutral:#5c6e60; --warm-muted-foreground:#617565; --neutral-400:#617565;
--citrus:#3e7b18; --citrus-ink:#f7fbf2;
--alpha:#3e7b18; --alpha-ink:#f7fbf2; --prime:#93690b; --prime-ink:#fffdf4; --mkt:#4a4fb5; --mkt-ink:#f4f4ff;
--primary:#3e7b18; --primary-foreground:#f7fbf2; --secondary:#e8eee3; --secondary-foreground:#14211a;
--accent:#3e7b18; --accent-foreground:#f7fbf2; --ring:#3e7b18;
--good:#2f7d46; --risk:#b5502f; --destructive:#b5502f; --destructive-foreground:#f7fbf2;
--green-accent:#3e7b18; --sun-amber:#93690b;
--yuzu-brand:#3e7b18; --yuzu-dark:#2e5c11; --yuzu-neutral:#14211a; --yuzu-gold:#93690b;
--badge-info-bg:#e9eaf7; --badge-info-text:#4a4fb5;
--chart-1:#3e7b18; --chart-2:#93690b; --chart-3:#4a4fb5; --chart-4:#14211a; --chart-5:#8ca090;
--green-yuzu-50:#f1f7ec; -100:#e1efd6; -200:#c9e2b4; -300:#a6ce85; -400:#7fb253; -600:#3e7b18; -900:#23480e; -950:#142b06;
--yellow-yuzu-50:#fbf7ea; -100:#f6eed2; -200:#eddfae; -300:#d9be68; -600:#93690b; -700:#7a5609; -900:#4a3405; -950:#2c1f03;
--tint-alpha:#f3f6f0; --tint-prime:#f9f7f0; --tint-mkt:#f7faff;
--mark:#2e5c11; --mark-2:#7a5609;
--liquid-top:#3e7b184d; --liquid-bottom:#3e7b18b8;
--radius:.625rem;

## Dark tokens (.dark)
--background:#0a120c; --foreground:#eef5ec; --surface:#101a12; --surface-2:#16221a;
--card:#101a12; --card-foreground:#eef5ec; --popover:#101a12;
--line:#1f2e2380; --line-solid:#1f2e23; --line-strong:#2e4434; --border:#1f2e23; --input:#1f2e23; --border-prominent:#2e4434;
--muted:#16221a; --muted-foreground:#9db3a0; --faint:#708674; --text-neutral:#9db3a0; --warm-muted-foreground:#708674; --neutral-400:#708674;
--citrus:#9fe870; --citrus-ink:#0b1505; --alpha:#9fe870; --alpha-ink:#0b1505; --prime:#edc15f; --prime-ink:#171003; --mkt:#a8adff; --mkt-ink:#0d0e1f;
--primary:#9fe870; --primary-foreground:#0b1505; --secondary:#16221a; --secondary-foreground:#eef5ec;
--accent:#9fe870; --accent-foreground:#0b1505; --ring:#9fe870;
--good:#8bd69b; --risk:#e8845e; --destructive:#e8845e; --destructive-foreground:#171003;
--green-accent:#9fe870; --sun-amber:#edc15f; --yuzu-brand:#9fe870; --yuzu-dark:#7fcb52; --yuzu-neutral:#eef5ec; --yuzu-gold:#edc15f;
--badge-info-bg:#1b1d34; --badge-info-text:#a8adff;
--chart-1:#9fe870; --chart-2:#edc15f; --chart-3:#a8adff; --chart-4:#eef5ec; --chart-5:#5f7263;
--green-yuzu-50:#0d1a08; -100:#16290f; -200:#22401a; -300:#4e8c33; -400:#9fe870; -600:#b6ee92; -900:#d2f5bc; -950:#e7fada;
--yellow-yuzu-50:#1a1405; -100:#241b06; -200:#3a2c0b; -300:#edc15f; -600:#edc15f; -700:#d9a93f; -900:#f3d48f; -950:#f8e6bc;
--tint-alpha:#0b1610; --tint-prime:#16120a; --tint-mkt:#0b0e1a;
--mark:#9fe870; --mark-2:#edc15f;
--liquid-top:#9fe87029; --liquid-bottom:#9fe87066;

## Prime scope (.prime-scope, dark)
--liquid-top:#edc15f29; --liquid-bottom:#edc15f66; --prime-accent:#f0b03c; --prime-accent-dark:#d1912a;
--background:var(--tint-prime); --surface:#1a1610; --surface-2:#221d16; --card:#1a1610; --muted:#221d16;
--line:#2e281f80; --line-solid:#2e281f; --line-strong:#443b2e; --border:#2e281f; --border-prominent:#443b2e;
--foreground:#f5f1ec;

## Section offsets @1200px (reveal anims disabled)
hero 65→814 | partners 814 (h219) | products 1033 (h2439, sticky 3-step in reality)
security 3472 (h2668) | transparency 6140 (h676) | contact/concierge 6815 (h493) | faq 7308 (h734) | footer after ~8042
