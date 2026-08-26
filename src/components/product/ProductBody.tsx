import type { Product } from "@/data/content";
import { asset } from "@/data/content";
import type { ProductPage, Vault } from "@/data/productPages";
import { ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  CARD,
  PAD,
  SECTION,
  SectionHead,
  TokenSet,
  WRAP,
} from "@/components/product/ProductShell";
import { CitrusField } from "@/components/product/CitrusField";
import { Reveal } from "@/components/product/Reveal";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon } as const;

/* --------------------------------- vault ---------------------------------- */

/** Thẻ vault của bản dev: viền, hover NHẤC LÊN 4px kèm bóng accent, icon tròn
 * nhấp lệch pha, và bảng chỉ số 2 CỘT dính đáy thẻ (`mt-auto`) để mọi thẻ trong
 * hàng có chân bảng thẳng nhau. */
function VaultCard({ v, i }: { v: Vault; i: number }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 p-5",
        CARD,
        "will-change-transform transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] hover:shadow-[0_18px_38px_-22px_color-mix(in_srgb,var(--accent)_70%,transparent)]",
      )}
    >
      <div className="flex items-center gap-2.5">
        {v.icon && (
          <img
            src={asset(v.icon)}
            alt=""
            className="citrus-bob-fast size-7 shrink-0 rounded-full"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        )}
        <h3 className="text-[17px] font-semibold text-foreground">{v.name}</h3>
      </div>
      <p className="text-[13.5px] leading-[1.55] text-muted-foreground">{v.desc}</p>
      {v.metrics.length > 0 && (
        <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line-solid pt-4">
          {v.metrics.map((m) => (
            <div key={m.label}>
              <dt className="microlabel">{m.label}</dt>
              <dd className="mt-0.5 text-[13.5px] font-medium tabular-nums text-foreground">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------- composition ------------------------------ */

/** Ghi chú dưới tiêu đề, có một cụm chữ là link (bản dev gắn "asset whitelist"). */
function Note({
  text,
  link,
}: {
  text: string;
  link?: { text: string; href: string };
}) {
  if (!link || !text.includes(link.text)) {
    return <>{text}</>;
  }
  const [before, after] = text.split(link.text);
  return (
    <>
      {before}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
      >
        {link.text}
      </a>
      {after}
    </>
  );
}

/**
 * Danh sách trọng số của Alpha — bản dev KHÔNG dùng biểu đồ tròn ở trang sản
 * phẩm, mà là từng dòng có thanh tiến trình chạy từ 0 tới đúng tỉ lệ khi cuộn
 * tới. Thanh lệch pha nhau 90ms cho có nhịp.
 */
function WeightList({ p }: { p: Product }) {
  const ref = useRef<HTMLUListElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className="mt-9">
      {p.slices.map((s, i) => (
        <li key={s.label} className="border-t border-line-solid py-4 first:border-t-0">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-14 shrink-0 font-mono text-[15px] font-semibold tabular-nums text-accent">
              {s.weight !== null ? `${s.weight}%` : "—"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-foreground">{s.label}</span>
              <span className="mt-0.5 block text-[13.5px] leading-[1.5] text-muted-foreground">
                {s.detail}
              </span>
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2 sm:ml-20 sm:w-[calc(100%-5rem)]">
            <div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in srgb, var(--accent) 45%, transparent), var(--accent))",
                width: run && s.weight !== null ? `${s.weight}%` : 0,
                transition: `width 1s cubic-bezier(.22,.61,.36,1) ${i * 0.09}s`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Marketplace: mỗi vault là một exposure riêng nên phần này là lưới 3 thẻ vault.
 * Alpha: một danh mục có trọng số nên là quả chanh + danh sách trọng số.
 */
export function Composition({
  p,
  head,
  vaults,
}: {
  p: Product;
  head: ProductPage["composition"];
  vaults?: Vault[];
}) {
  return (
    <section className={cn("relative overflow-hidden", SECTION, PAD)}>
      <CitrusField seed={2273} count={9} />
      <div className={cn("relative", WRAP)}>
        {/* Ghi chú nằm TRONG cùng khối reveal với tiêu đề, đúng như bản dev. */}
        <Reveal>
          <span className="kicker">{head.kicker}</span>
          <h2 className="mt-4 max-w-[620px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[40px]">
            {head.title}
          </h2>
          {head.note && (
            <p className="mt-4 max-w-[620px] text-[14.5px] leading-[1.6] text-muted-foreground">
              <Note text={head.note} link={head.noteLink} />
            </p>
          )}
        </Reveal>


        {vaults ? (
          /* Cả "More on the way" cũng nằm TRONG lưới, làm thẻ thứ 4 xuống hàng
             hai — bản dev để vậy. Tách nó ra ngoài thì section hụt 58px. */
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {vaults.map((v, i) => (
              <Reveal key={v.name} y={24} delay={i * 0.08}>
                <VaultCard v={v} i={i} />
              </Reveal>
            ))}
          </div>
        ) : (
          <WeightList p={p} />
        )}

      </div>
    </section>
  );
}

/* ---------------------------------- terms --------------------------------- */

/**
 * Trên bản dev, Terms và bộ token nằm CHUNG một section (`border-y`): ba thẻ
 * spec trước, rồi `mt-9` tới lưới token. Vì vậy `TokenSet` được gọi từ đây chứ
 * không phải là một section riêng.
 */
export function Terms({
  p,
  head,
  tokens,
  tokensNote,
}: {
  p: Product;
  head: ProductPage["terms"];
  tokens: ProductPage["tokens"];
  tokensNote?: string;
}) {
  return (
    <section className={cn("border-y border-line-solid", SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={head.kicker} title={head.title} />

        <Reveal className="mt-9" delay={0.08}>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {p.facts.map((f) => {
              const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3.5 rounded-md border border-line-solid bg-surface px-3.5 py-3 sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5 sm:text-center"
                >
                  <div className="shrink-0 sm:mb-2.5">
                    <Icon className="citrus-bob-fast size-7 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="microlabel">{f.label}</div>
                    <div className="mt-1 text-[12.5px] font-medium leading-[1.4] text-foreground">
                      {f.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <TokenSet tokens={tokens} note={tokensNote} />
      </div>
    </section>
  );
}
