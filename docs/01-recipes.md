# Class recipes (exact, from live DOM)

## Utility CSS classes (custom)
```css
.data { font-family: var(--font-mono); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.microlabel { font-family: var(--font-mono); letter-spacing:.1em; text-transform:uppercase; color:var(--faint); font-size:10px; }
.kicker { font-family: var(--font-mono); letter-spacing:.14em; text-transform:uppercase; color:var(--accent); display:inline-flex; align-items:center; gap:10px; font-size:11px; }
.marquee { position:relative; overflow:hidden; overscroll-behavior-x:contain;
  mask-image:linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
.marquee-track { display:flex; flex:0 0 auto; width:max-content; animation: marquee-slide 46s linear infinite; }
.marquee-run { display:flex; flex:0 0 auto; align-items:center; gap:30px; padding-right:30px; }
@media (max-width:639px){ .marquee-run{ gap:20px; padding-right:20px } }
@keyframes marquee-slide { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.marquee:hover .marquee-track, .marquee:focus-within .marquee-track { animation-play-state: paused; }
.stat-box:hover .microlabel, .stat-box:focus-within .microlabel { color: var(--foreground); }
.stat-box:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@keyframes orbit-spin { to { transform: rotate(360deg) } }
@keyframes orbit-counter-spin { to { transform: rotate(-360deg) } }
.ring.spin { animation: ringspin 90s linear infinite; }
```

## Header
```
header: sticky top-0 z-50 border-b border-line-solid
        bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-[14px]
  nav:  mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 lg:px-[60px]
    a(logo) > img.block w-auto h-8      (/assets/yuzu-wordmark.svg)
    ul: hidden items-center gap-5 md:flex lg:gap-7
      li > div.relative
        button: group/nav flex items-center gap-1 py-1 text-[13.5px] font-medium transition-colors duration-150
          span(underline): absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ease-out
        dropdown: absolute left-1/2 top-full z-50 w-[268px] -translate-x-1/2 pt-3 transition-all duration-150
          ul: overflow-hidden rounded-lg border border-line-solid bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.28)]
            a: flex items-start gap-2.5 rounded-md px-2.5 py-2 hover:bg-surface-2
              span(dot): mt-[7px] size-2 shrink-0 rounded-full
              span > span.block text-[13.5px] font-medium text-foreground
                     span.mt-px block text-[12px] leading-[1.4] text-muted-foreground
    right: hidden items-center gap-3 md:flex
      theme btn: flex h-10 w-10 items-center justify-center rounded-sm border border-line-solid
                 text-muted-foreground hover:border-line-strong hover:text-foreground
      cta a: h-10 rounded-sm bg-foreground px-[18px] text-[13.5px] font-semibold text-background
             hover:bg-[color-mix(in_srgb,var(--foreground)_86%,var(--background))]
    mobile: flex items-center gap-2 md:hidden
```
Nav items: Products(dropdown: Alpha/Stablecoin engine, Prime/Tokenized fixed income, Marketplace/Curated single strategies), Security, Transparency, Concierge, FAQ, Research(external ↗)

## Hero (section 1)
```
section: flex min-h-[calc(100svh-64px)] flex-col justify-center px-6 py-12 lg:px-[60px]
  div: mx-auto w-full max-w-[1160px]
    div: grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-14
      col1 > div.text-center lg:text-left
        h1: text-[32px] font-semibold leading-[1.06] tracking-[-0.015em] text-foreground sm:text-[40px] lg:text-[50px]
            "The " <span class="text-accent">Yield Engine</span> <br/> "for Neobanks"
        p:  mx-auto mt-5 max-w-[50ch] text-[15px] leading-[1.65] text-muted-foreground lg:mx-0
        div: mt-7 flex flex-wrap justify-center gap-3 lg:justify-start
          a1: group h-10 gap-2 rounded-sm bg-foreground px-[18px] text-[13.5px] font-semibold text-background  ("Launch app" + arrow svg)
          a2: h-10 rounded-sm border border-line-strong bg-transparent px-[18px] text-[13.5px] font-semibold text-foreground
              hover:border-accent hover:text-accent  ("Integrate us")
      col2 (orbit visual)
        div: mx-auto aspect-square w-[min(280px,66vw)] lg:w-full
          div.relative size-full  → dotted rings svg(vb 0 0 100 100), centered sphere (rounded-full overflow-hidden),
            citrus slice svg (vb 0 0 146 146), orbiting token badges (rounded-full shadow-[0_0_0_1px_color-mix(in_srgb,var(--citrus)_45%,transparent)] dark:shadow-none),
            3 label pills: Tokenized RWA / Risk Tranching / DeFi Composability
    STATS: div.mt-20 md:mt-24
      div.grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4
        div: stat-box group relative rounded-lg border border-line-solid bg-surface p-4
             transition-colors hover:border-line-strong focus-within:border-line-strong
          liquid wave: div.pointer-events-none absolute inset-0 overflow-hidden rounded-lg > svg(vb 0 0 200 100)
          div.relative z-10
            div.flex items-center gap-1.5 > span.microlabel   (+ optional good dot)
            div: data mt-2.5 text-[26px] font-medium leading-none text-foreground
          tooltip: pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-64 -translate-x-1/2
                   rounded-md border border-line-solid bg-surface p-3.5 opacity-0
                   shadow-[0_16px_40px_color-mix(in_srgb,var(--foreground)_16%,transparent)]
                   transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100
            head: mb-2.5 flex items-baseline justify-between gap-2 > span.microlabel "Breakdown"
            rows: flex flex-col gap-2.5
              row: flex items-center justify-between gap-2
                left: flex min-w-0 items-center gap-2
                  span.h-[6px] w-[6px] shrink-0 rotate-45 rounded-[1px]   (diamond, product color)
                  span.truncate text-[12.5px] text-muted-foreground
                  span.h-[5px] w-[5px] shrink-0 rounded-full bg-good      (attested dot)
                right: span.data shrink-0 text-[12.5px] font-medium text-foreground
              children: div.mt-1 flex flex-col gap-1 pl-4
                span.data text-[11.5px] text-faint / span.data text-[11.5px] text-muted-foreground
            note: p.mt-3 border-t border-line-solid pt-2.5 text-[10.5px] leading-[1.5] text-faint
            arrow: span.absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45
                   border-b border-r border-line-solid bg-surface
      footnote: p.mt-3.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] text-faint
        span.h-[6px] w-[6px] shrink-0 rounded-full bg-good
        a.text-good underline decoration-dotted underline-offset-2  "Accountable"
        span.data "Read 15 min ago."
```
4 stat boxes: TOTAL VALUE LOCKED $78.97M · YIELD PAID OUT $2.94M · ALPHA COLLATERAL RATIO 108.66% · PRIME BACKING 100.05%
(ratios rendered in accent green)

## Partners (section#partners)
```
section: border-b border-line-solid pt-9
  div.mb-5 flex justify-center > span.kicker "Partners"
  div.divide-y divide-line-solid border-t border-line-solid
    row (x3): div.relative flex h-12 items-center overflow-hidden
      div.marquee absolute inset-0 flex items-center
        div.marquee-track > ul.marquee-run (x2 copies)
          li.flex shrink-0 items-center
            a.flex items-center rounded-sm px-1 py-1 text-muted-foreground hover:text-foreground sm:gap-2
              img.h-6 w-6 shrink-0 rounded-full object-cover
              span.sr-only whitespace-nowrap text-[12.5px] font-medium sm:not-sr-only
      center label: div.pointer-events-none absolute inset-0 hidden justify-center sm:flex
        span.w-10 bg-[linear-gradient(90deg,transparent,var(--background))] sm:w-20
        h3.flex h-full w-[124px] items-center justify-center whitespace-nowrap border-x border-line-solid
           bg-background font-mono text-[9.5px] uppercase leading-none tracking-[0.16em] text-muted-foreground sm:w-[156px]
        span.w-10 bg-[linear-gradient(270deg,transparent,var(--background))] sm:w-20
```
Rows: CHAINS / PROTOCOLS / INFRASTRUCTURE

## Section wrappers
- products: `div#products.relative h-[300svh]`  (sticky 3-step scroll)
- security: `section#security.relative` (5 stacked sticky panels `.security-panel`)
- transparency: `section#transparency.relative px-6 py-16 md:px-[80px] md:py-[80px]`
- contact: `section#contact.border-t border-line-solid px-6 py-16 lg:px-[60px] lg:py-20`
- faq: `section#faq.px-6 py-16 lg:px-[60px] lg:py-20`
