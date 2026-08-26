import type { Product } from "@/data/content";
import { asset } from "@/data/content";
import type { ProductPage, Vault } from "@/data/productPages";
import { ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  PAD,
  SECTION,
  SectionHead,
  TokenSet,
  WRAP,
} from "@/components/product/ProductShell";
import { CitrusChart, SliceDetail } from "@/components/ui/CitrusChart";
import { Reveal } from "@/components/product/Reveal";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon } as const;

/* --------------------------------- vault ---------------------------------- */

/** Thẻ vault của bản dev: viền, hover NHẤC LÊN 4px kèm bóng accent, icon tròn
 * nhấp lệch pha, và bảng chỉ số 2 CỘT dính đáy thẻ (`mt-auto`) để mọi thẻ trong
 * hàng có chân bảng thẳng nhau. */
function VaultCard({ v, i }: { v: Vault; i: number }) {
  return (
    /* Nếp home: nền xanh nhạt, KHÔNG stroke. Hover chỉ nhấc thẻ lên 1 nấc —
       bỏ hẳn viền đổi màu và vệt đổ bóng màu accent. Kẻ ngang trong `dl` bên
       dưới giữ nguyên: đó là vạch phân cách nội dung, không phải viền thẻ. */
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg bg-surface p-5",
        "will-change-transform transition-transform duration-300 hover:-translate-y-1",
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
 * Marketplace: mỗi vault là một exposure riêng nên phần này là lưới 3 thẻ vault.
 * Alpha: một danh mục có trọng số nên là quả chanh + danh sách trọng số.
 */
/**
 * Tỉ trọng vẽ bằng QUẢ CHANH CÓ MÚI của trang chủ, không phải mấy thanh ngang.
 * Dùng lại nguyên `CitrusChart` + `SliceDetail` và chính bộ `slices` trong
 * content.ts mà trang chủ đang dùng, nên không phát sinh nội dung mới và hover
 * một múi thì thẻ mô tả đổi theo y như ngoài home.
 */
function SliceArt({ p }: { p: Product }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Reveal y={24}>
      <div className="mx-auto mt-9 max-w-[460px]">
        <CitrusChart
          id={`comp-${p.id}`}
          accent={p.color}
          slices={p.slices}
          active={active}
          setActive={setActive}
        />
        <SliceDetail slices={p.slices} accent={p.color} active={active} />
      </div>
    </Reveal>
  );
}

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
      <div className={cn("relative", WRAP)}>
        {/* Khối tiêu đề canh GIỮA — nếp của web này, bản dev canh trái. */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="kicker">{head.kicker}</span>
            <h2 className="mt-4 max-w-[620px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[40px]">
              {head.title}
            </h2>
            {head.note && (
              <p className="mt-4 max-w-[620px] text-[14.5px] leading-[1.6] text-muted-foreground">
                <Note text={head.note} link={head.noteLink} />
              </p>
            )}
          </div>
        </Reveal>

        {vaults ? (
          /* Cả "More on the way" cũng nằm TRONG lưới, làm thẻ thứ 4 xuống hàng
             hai — bản dev để vậy. Tách nó ra ngoài thì section hụt 58px. */
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {vaults.map((v, i) => (
              /* Thẻ "More on the way" trải hết hàng thay vì đứng lẻ một phần ba —
                 nó không có số liệu nên để hẹp bằng ba thẻ kia thì hụt hẳn. */
              <Reveal
                key={v.name}
                y={24}
                delay={i * 0.08}
                className={v.upcoming ? "md:col-span-3" : undefined}
              >
                <VaultCard v={v} i={i} />
              </Reveal>
            ))}
          </div>
        ) : (
          <SliceArt p={p} />
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
        {/* Theo nếp home: tiêu đề canh GIỮA, thẻ nền xanh nhạt (--surface-2) và
            BỎ stroke — giống stat box ngoài trang chủ, không phải thẻ viền nền
            trắng của bản dev. */}
        <SectionHead kicker={head.kicker} title={head.title} center />

        <Reveal className="mt-9" delay={0.08}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {p.facts.map((f) => {
              const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3.5 rounded-lg bg-surface px-3.5 py-3 text-center sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5"
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
