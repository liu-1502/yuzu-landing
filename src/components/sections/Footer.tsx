import { Fragment } from "react";
import { asset, footer } from "@/data/content";
import { ArrowUpRight } from "@/components/ui/Icons";
import { DiscordMark, TelegramMark, XMark } from "@/components/ui/SocialMarks";
import CenterUnderline from "@/components/fancy/text/underline-center";

const SOCIAL_MARKS = { X: XMark, Telegram: TelegramMark, Discord: DiscordMark };

/** Mặt nước gợn sóng, vẽ trong hệ toạ độ 179x60 của file logo gốc. */
const WAVE_SPAN = 179 + 71.6;

const wave = (offset: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= WAVE_SPAN; x += 2) {
    const y = 38 + Math.sin((x / 179) * Math.PI * 5 + offset) * 2.2;
    pts.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return `${pts.join(" ")} L${WAVE_SPAN} 60 L0 60 Z`;
};

/**
 * Logo khổng lồ ở đáy trang, có nước dâng bên trong.
 *
 * Mask lấy thẳng file gốc nên khoảng cách icon–chữ và tỉ lệ đúng bản gốc, và vì
 * mask áp lên cả khối nên nước chảy vào **cả icon lẫn chữ** — không cần dựng lại
 * lockup bằng clipPath như bản trước.
 *
 * Khung ngoài thấp hơn logo (179/52 so với 179/60) và `overflow-hidden`, nên phần
 * chân chữ bị cắt bớt một chút — logo trông như tụt xuống dưới mép trang.
 */
function JuiceWordmark() {
  const src = asset("/assets/yuzu-wordmark.svg");
  const mask = {
    maskImage: `url("${src}")`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  } as React.CSSProperties;

  return (
    <div className="mt-10 px-6 md:px-[60px]">
      <div className="mx-auto aspect-[179/52] w-full max-w-[1000px] overflow-hidden">
        <div
          role="img"
          aria-label="Yuzu"
          className="relative aspect-[179/60] w-full select-none"
          style={mask}
        >
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]" />
          <svg
            viewBox="0 0 179 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="yz-juice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path className="juice-drift" d={wave(0)} fill="url(#yz-juice)" />
            <path className="juice-drift-slow" d={wave(1.9)} fill="url(#yz-juice)" opacity="0.55" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  /* Mép trên footer KHÔNG có kẻ nét nào: cặp vạch gradient + chấm tròn đã dời
     lên đầu section CTA ("Put a dollar to work…"), xem `ClosingCta`. */
  return (
    <footer className="relative overflow-hidden bg-surface pb-0 pt-8 md:pt-16">
      <div className="relative px-6 md:px-[60px]">
        <div className="mx-auto max-w-[1024px]">
          {/* Trái: 3 logomark liên hệ. Phải: hàng text link. */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div>
              <ul className="flex items-center gap-1">
                {footer.socials.map((sc) => {
                  const Mark = SOCIAL_MARKS[sc.label as keyof typeof SOCIAL_MARKS];
                  return (
                    <li key={sc.label}>
                      <a
                        href={sc.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={sc.label}
                        className="flex size-8 items-center justify-center rounded-full text-foreground transition-opacity hover:opacity-70"
                      >
                        <Mark />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <nav>
              <ul className="grid grid-cols-3 gap-x-6 gap-y-3 md:flex md:flex-wrap md:justify-end md:gap-x-7">
                {footer.links.map((l) => (
                  <li key={l.label}>
                    <CenterUnderline
                      as="a"
                      href={l.href}
                      className="text-[13.5px] font-medium text-foreground"
                    >
                      {l.label}
                      {/* Mũi tên nằm trong children nên ăn chung gạch chân; icon
                          inline chứ không flex, vì CenterUnderline bọc children
                          trong <span> riêng mà ta không style được. */}
                      <ArrowUpRight className="ml-1 inline size-3.5 align-[-2px] text-muted-foreground" />
                    </CenterUnderline>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-line-solid pt-6 md:flex-row">
            <p className="flex w-full flex-wrap items-center justify-center gap-x-2.5 font-mono text-[11px] leading-[1.7] text-muted-foreground md:justify-start">
              {footer.legalLine.map((t, i) => (
                <Fragment key={t}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="text-[color-mix(in_srgb,var(--foreground)_28%,transparent)]"
                    >
                      |
                    </span>
                  )}
                  <span>{t}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      <JuiceWordmark />
    </footer>
  );
}
