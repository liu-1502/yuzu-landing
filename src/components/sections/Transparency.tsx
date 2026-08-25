import { useState } from "react";
import { transparency } from "@/data/content";
import { AccountableMark, AttestIcon, SolvencyIcon, WhitelistIcon } from "@/components/ui/Icons";
import { splitLinks } from "@/lib/utils";

const ICONS = { solvency: SolvencyIcon, attest: AttestIcon, whitelist: WhitelistIcon };

/** Bán kính vệt loang — phải ≥ đường chéo card để phủ hết dù chuột vào từ góc nào. */
const INK = 1100;

/**
 * Một card minh bạch. Hover không đổ bóng nữa: một vệt xanh lá hình tròn phình ra
 * từ đúng điểm con chuột đi vào, loang dần phủ kín card. Rời chuột thì thu về lại
 * điểm đó. Vệt bị `overflow-hidden` của card cắt nên không ảnh hưởng layout.
 */
function Card({ card }: { card: (typeof transparency.cards)[number] }) {
  const Icon = ICONS[card.icon as keyof typeof ICONS];
  const [ink, setInk] = useState({ x: "50%", y: "50%" });
  const [wet, setWet] = useState(false);

  return (
    <div className="[perspective:900px]">
      <div
        className="group relative flex h-[313px] flex-col items-center overflow-hidden rounded-[24px] bg-surface p-8 text-center transition-transform duration-300 ease-out hover:-translate-y-1.5 motion-reduce:transition-none"
        onPointerEnter={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setInk({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
          setWet(true);
        }}
        onPointerLeave={() => setWet(false)}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full transition-transform duration-[650ms] ease-out motion-reduce:transition-none"
          style={{
            left: ink.x,
            top: ink.y,
            width: INK,
            height: INK,
            marginLeft: -INK / 2,
            marginTop: -INK / 2,
            background: "color-mix(in srgb, var(--citrus) 16%, transparent)",
            transform: wet ? "scale(1)" : "scale(0)",
          }}
        />

        <div className="relative mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--citrus)_10%,transparent)] text-citrus transition-[background-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-[color-mix(in_srgb,var(--citrus)_18%,transparent)]">
          <Icon />
        </div>

        <h3 className="relative mb-3 text-[17px] font-semibold leading-tight text-foreground">
          {card.title}
        </h3>

        <p className="relative flex-1 text-[13.5px] leading-[1.6] text-muted-foreground">
          {splitLinks(card.body).map((seg, i) =>
            seg.link ? (
              <a
                key={i}
                href={seg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground underline underline-offset-2"
              >
                {seg.text}
              </a>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>

        {"logoHref" in card && card.logoHref && (
          <a
            href={card.logoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <AccountableMark className="h-5 w-5 shrink-0" />
            {/* Có chữ rồi nên bỏ aria-label — tên gọi lấy từ chính text này */}
            <span className="text-[14px] font-semibold leading-none">Accountable</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function Transparency() {
  return (
    <section id="transparency" className="section-tint relative px-6 py-8 md:px-[60px] md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="kicker">{transparency.kicker}</span>
          <h2 className="text-[30px] font-semibold text-foreground md:text-[40px] md:leading-[1.15]">
            {transparency.title}
          </h2>
          <p className="max-w-[54ch] text-[15.5px] leading-[1.65] text-muted-foreground">
            {transparency.body}
          </p>
        </div>

        <div className="grid w-full gap-8 md:grid-cols-3">
          {transparency.cards.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
