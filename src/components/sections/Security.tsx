import { useEffect, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { asset, securityIntro, securityPanels } from "@/data/content";
import { ExternalLink } from "@/components/ui/Icons";
import {
  RadarVisual,
  TrancheStack,
  WalletVisual,
} from "@/components/ui/SecurityVisuals";
import StackingCards, {
  StackingCardItem,
  useStackingCardsContext,
} from "@/components/fancy/blocks/stacking-cards";

/**
 * Độ hở giữa hai thẻ đã ghim. Ràng buộc hai đầu, đo trên 5 panel:
 *  - đáy tiêu đề cách mép thẻ 79–87px → cần ≥ 87 + 16 = 103 để tiêu đề nào cũng hở 16px;
 *  - đoạn body bắt đầu sau tiêu đề đúng `gap-6` = 24px → phải ≤ 79 + 24 = 103 để
 *    không panel nào hở một mẩu dòng body bị cắt ngang.
 * Đúng 103. Chính vì thế `gap` giữa tiêu đề và body là 6 (24px) chứ không phải 4 (16px):
 * với 16px thì hai ràng buộc trên triệt tiêu nhau, không có giá trị nào thoả.
 * `h3` buộc `md:whitespace-nowrap` để tiêu đề luôn 1 dòng — 2 dòng cần 129px/bậc,
 * thẻ trước mặt không còn chỗ.
 */
const STRIP = 103;

/** Item cao thêm 1 bậc so với viewport (xem chú thích ở `StackingCardItem`). */
const EXTRA = 104;

/** Thẻ ghim ở 128px = 64 header + 64 hở. */
const STICKY_TOP = 128;

/** Đuôi trống 100svh nối sau thẻ cuối. Nhờ nó thẻ số 5 còn ghim thêm đúng một màn
 * để Transparency (-mt-[100svh]) trượt phủ lên, thay vì đẩy nó đi.
 *
 * Phải là một div rỗng thật, KHÔNG dùng padding-bottom trên deck: sticky bị chặn
 * bởi content box của cha, padding không tính — đã thử và thẻ 5 vẫn nhả đúng chỗ cũ.
 * Đuôi cũng kéo dài dải scroll mà useScroll đo, nên mốc `covered` phải cộng nó vào
 * mẫu số. */
const TAIL_SCREENS = 1;

/** Bật xếp thẻ khi màn đủ rộng và người dùng không tắt animation. */
function useStacking() {
  const [on, setOn] = useState(false);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setOn(wide.matches && !calm.matches);
      setVh(window.innerHeight);
    };
    sync();
    wide.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      wide.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return { on, vh };
}

/**
 * Một panel. Ngoài phần mặt thẻ (viền + bo 40px + max 1280) còn tự biết mình đã bị
 * thẻ sau phủ chưa: thẻ cao đúng 1 viewport nên thẻ thứ k ghim tại k/(N−1), tức thẻ
 * này bị phủ từ (index+1)/(N−1). Khi đó chỉ còn dải mép hiện ra nên số thứ tự ở dưới
 * không thấy được — đẩy nó lên trước tiêu đề thành "1. Security Audits".
 * Thẻ cuối không bị gì phủ nên mốc của nó là lúc chính nó ghim.
 *
 * Mặt thẻ KHÔNG `h-full`: item phải cao 1 viewport cho phép tính ghim, nhưng nếu mặt
 * thẻ cũng cao 1 viewport thì cộng thêm `topPosition` (tối đa 412px) nó sẽ thò ra
 * ngoài item, chồng lên section dưới. Cho mặt thẻ hug nội dung là vừa hết tràn, vừa
 * vẫn phủ kín thẻ trước — các mặt thẻ lệch nhau 103px nên chỉ hở đúng dải mép.
 */
function Panel({
  panel,
  index,
  tinted,
  enabled,
  vh,
}: {
  panel: (typeof securityPanels)[number];
  index: number;
  tinted: boolean;
  enabled: boolean;
  vh: number;
}) {
  const { progress, totalCards = 1 } = useStackingCardsContext();
  const [covered, setCovered] = useState(false);

  // Thẻ k ghim khi khối đã cuộn được k·H − STICKY_TOP, trên tổng dải N·H − vh.
  // Thẻ này bị phủ đúng lúc thẻ k = index+1 ghim.
  const h = vh + EXTRA;
  // Thẻ thường: bật khi thẻ kế tiếp ghim (lúc nó chỉ còn hở dải mép).
  // Thẻ cuối: không có thẻ nào phủ nó, nên bật ngay khi CHÍNH NÓ ghim.
  const last = index === totalCards - 1;
  const at =
    ((last ? index : index + 1) * h - STICKY_TOP) /
    Math.max(1, totalCards * h + TAIL_SCREENS * vh - vh);

  useMotionValueEvent(progress, "change", (p) =>
    setCovered(enabled && vh > 0 && p >= at),
  );

  return (
    <div
      className="security-panel relative mx-auto w-full max-w-[1280px] overflow-clip rounded-[40px]"
      style={{
        backgroundColor: tinted ? "var(--surface-2)" : "var(--surface)",
      }}
    >
      {/*
       * Thẻ có lề hai bên như mọi section (mép thẻ ở mốc 60px), nên chữ bên trong
       * thụt thêm đúng phần padding của thẻ. Hai thứ này loại trừ nhau: muốn chữ
       * cũng ở 60px thì mép thẻ phải ở 0, tức thẻ tràn viền, mất lề.
       */}
      <div className="relative z-10 px-6 py-10 md:py-12 lg:px-[60px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 md:flex-row md:items-stretch md:gap-[60px]">
          {/*
                     * `min-w-0` là bắt buộc: `h3` có `md:whitespace-nowrap` nên
                     * min-content của cột chữ = bề rộng tiêu đề dài nhất (đo được
                     * 429px ở "Real-Time Threat Monitoring"). Không có nó thì cột
                     * chữ nở ra, đẩy hộp trắng của panel đó lệch 14px so với các
                     * panel còn lại.
                     */}
                  <div className="relative min-w-0 flex-1">
            <div className="relative z-10 flex flex-col gap-6 pt-0.5">
              <h3 className="text-2xl font-bold leading-[1.3] text-foreground md:whitespace-nowrap md:text-[32px]">
                {covered && (
                  <span
                    className="hidden md:inline"
                    style={{ color: "var(--mark)" }}
                  >
                    {panel.n}.{" "}
                  </span>
                )}
                {panel.title}
              </h3>
              <div className="flex flex-col gap-3">
                <p className="max-w-[520px] text-base leading-[1.3] text-muted-foreground">
                  {panel.body}
                </p>
                {panel.cta && (
                  <a
                    href={panel.cta.href}
                    className="inline-flex items-center gap-1.5 pt-[4.6px] text-base font-semibold transition-colors hover:opacity-80"
                    style={{ color: "var(--mark)" }}
                  >
                    {panel.cta.label}
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>

            <span
              className="pointer-events-none bottom-0 z-0 hidden select-none leading-none tracking-[-0.9px] md:bottom-[18px] md:left-0 md:block md:text-[240px] md:font-bold"
              style={{ color: "var(--mark)", opacity: covered ? 0 : 0.28 }}
              aria-hidden
            >
              {panel.n}
            </span>
          </div>

          <div className="relative flex h-auto w-full min-w-0 flex-1 items-center justify-center sm:h-[260px] md:h-auto">
            {/*
             * Nền ô gạch tràn sát mép panel ở trên / dưới / phải — offset đúng bằng
             * padding của hàng nội dung (`py-10 md:py-12`, `px-6 lg:px-[60px]`).
             * Mép trái giữ ở 0 nên vùng gạch vẫn đúng một nửa section theo chiều ngang.
             */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 -bottom-10 left-0 -right-6 opacity-[0.07] md:-top-12 md:-bottom-12 lg:-right-[60px]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Hộp trắng bao MỌI loại nội dung cột phải: logo hay illustration đều nằm trong */}
            {/*
             * Grid tràn thêm sang phải (24px / 60px ở lg) tới mép panel, còn mép
             * trái trùng cột — nên nếu hộp cứ `w-full` thì nó dán vào mép trái grid.
             * Đẩy hộp sang phải nửa phần tràn (và cho tràn ngược lại đúng nửa đó)
             * để lề grid hai bên hộp bằng nhau.
             */}
            <div className="relative ml-3 -mr-3 flex h-full w-full items-center justify-center rounded-[28px] border-2 border-line-strong bg-surface lg:ml-[30px] lg:-mr-[30px]">
              {panel.logos && panel.logos.length <= 3 && (
                <div className="flex items-center justify-center gap-7 px-8 py-7 sm:gap-10 sm:px-10 sm:py-9">
                  {panel.logos.map((l) => (
                    <div
                      key={l.name}
                      className="flex flex-col items-center justify-center gap-3 sm:gap-4"
                    >
                      <div className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-2xl sm:h-[160px] sm:w-[160px] sm:rounded-3xl">
                        <img
                          src={asset(l.icon)}
                          alt={l.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="w-[92px] text-center text-[13px] font-semibold leading-tight text-foreground sm:w-[160px] sm:text-base sm:leading-4">
                        {l.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {panel.logos && panel.logos.length > 3 && (
                <div className="flex flex-col items-center justify-center gap-8 px-8 py-7 md:gap-10">
                  {[panel.logos.slice(0, 3), panel.logos.slice(3, 6)].map(
                    (row, r) => (
                      <div
                        key={r}
                        className="flex items-center gap-7 sm:gap-12"
                      >
                        {row.map((l) => (
                          <div
                            key={l.name}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="flex items-center justify-center rounded-full bg-muted p-1">
                              <div className="h-[52px] w-[52px] overflow-hidden rounded-full">
                                <img
                                  src={asset(l.icon)}
                                  alt={l.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                            <span className="text-[13px] font-semibold text-foreground sm:text-base">
                              {l.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}

              {panel.visual === "tranche" && <TrancheStack />}
              {panel.visual === "radar" && <RadarVisual />}
              {panel.visual === "wallet" && <WalletVisual />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Security() {
  const { on: stacking, vh } = useStacking();

  return (
    <section
      id="security"
      /* -mt-[100svh]: kéo cả section lên đè vào màn cuối của #products. Trong quãng
         đó tấm Marketplace vẫn đang ghim (sticky chưa hết khung cha), nên Security
         trượt phủ lên nó thay vì đẩy nó đi. z-10 để nằm trên, section-tint là nền
         đục nên không lộ tấm phía sau. */
      className="section-tint relative z-10 -mt-[100svh]"
    >
      <div className="relative px-6 py-8 md:px-[60px] md:py-16 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line-solid before:content-['']">
        <div className="mx-auto max-w-[1280px] text-center">
          <span className="kicker mb-5">{securityIntro.kicker}</span>
          <h2 className="text-[30px] font-semibold text-foreground md:text-[40px] md:leading-[1.15]">
            {securityIntro.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[54ch] text-[15.5px] leading-[1.65] text-muted-foreground">
            {securityIntro.body}
          </p>
        </div>
      </div>

      <StackingCards
        className="relative"
        totalCards={securityPanels.length}
        scaleMultiplier={stacking ? 0.03 : 0}
      >
        {securityPanels.map((panel, i) => {
          const even = i % 2 === 1;
          return (
            <StackingCardItem
              key={panel.title}
              index={i}
              // Mặc định của thư viện (${5 + index * 3}%) chỉ hở 25px — không đủ thấy
              // tiêu đề thẻ dưới.
              // Mobile / reduced-motion: về 0, không thì mặt panel trôi xuống rồi bị
              // panel sau che mất nội dung đáy.
              topPosition={stacking ? `${i * STRIP}px` : "0px"}
              // H ≥ vh là điều kiện để mọi thẻ đều ghim được tới đỉnh (dải scroll của
              // khối là N·H − vh, thẻ cuối cần ghim tại (N−1)·H). Cộng thêm 1 bậc
              // (104px) để mặt thẻ cuối — đã lệch (N−1)·STRIP = 412px — không thò ra
              // ngoài item rồi chồng lên section dưới.
              // Lệch khỏi `top-0` của thư viện: ghim ở 128px = 64px header + 64px
              // khoảng hở, để thẻ đầu tiên không dính vào header.
              className="w-full px-6 lg:px-[60px] md:top-32 md:h-[calc(100svh+104px)]"
              style={{ zIndex: i + 1 }}
            >
              <Panel
                panel={panel}
                index={i}
                tinted={even}
                enabled={stacking}
                vh={vh}
              />
            </StackingCardItem>
          );
        })}

        {/* Đuôi giữ thẻ cuối còn ghim — xem TAIL_SCREENS. */}
        <div aria-hidden className="h-[100svh]" />
      </StackingCards>
    </section>
  );
}
