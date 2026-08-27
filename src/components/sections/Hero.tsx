import { useRef } from "react";
import { hero, stats, statsFootnote } from "@/data/content";
import { ArrowUpRight } from "@/components/ui/Icons";
import { OrbitVisual } from "@/components/ui/OrbitVisual";
import { StatBox } from "@/components/ui/StatBox";
import UnderlineToBackground from "@/components/fancy/text/underline-to-background";
import VariableFontCursorProximity from "@/components/fancy/text/variable-font-cursor-proximity";

/** Cấu hình chung cho hiệu ứng con trỏ trên tiêu đề — `wght` 600 là trạng thái nghỉ,
 *  đúng bằng font-semibold nên chưa rê chuột thì trông y như cũ. */
const titleFx = (containerRef: React.RefObject<HTMLHeadingElement | null>) => ({
  containerRef,
  fromFontVariationSettings: "'wght' 600",
  toFontVariationSettings: "'wght' 800",
  radius: 90,
  falloff: "gaussian" as const,
});

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section
      id="top"
      className="flex min-h-[calc(100svh-64px)] flex-col justify-center px-6 py-8 md:py-16 lg:px-[60px]"
    >
      <div className="mx-auto w-full max-w-[1024px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-14">
          <div>
            <div className="text-center lg:text-left">
              <h1
                ref={titleRef}
                className="text-[32px] font-semibold leading-[1.06] tracking-[-0.015em] text-foreground sm:text-[40px] lg:text-[50px]"
              >
                <VariableFontCursorProximity {...titleFx(titleRef)}>
                  {hero.titleLead}
                </VariableFontCursorProximity>
                <VariableFontCursorProximity className="text-accent" {...titleFx(titleRef)}>
                  {hero.titleAccent}
                </VariableFontCursorProximity>
                <br />
                <VariableFontCursorProximity {...titleFx(titleRef)}>
                  {hero.titleTail}
                </VariableFontCursorProximity>
              </h1>

              <p className="mx-auto mt-5 max-w-[50ch] text-[15px] leading-[1.65] text-foreground lg:mx-0">
                {hero.body}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href={hero.primary.href}
                  className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-foreground px-[18px] text-[13.5px] font-semibold text-background outline-none transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_86%,var(--background))] focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {hero.primary.label}
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={hero.secondary.href}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-line-strong bg-transparent px-[18px] text-[13.5px] font-semibold text-foreground outline-none transition-colors hover:border-accent hover:text-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {hero.secondary.label}
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="mx-auto aspect-square w-[min(280px,66vw)] lg:w-full">
              <OrbitVisual />
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-24">
          <div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {stats.map((s) => (
                <StatBox key={s.label} stat={s} />
              ))}
            </div>
            <p className="mt-3.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] text-faint">
              {statsFootnote.before}{" "}
              <UnderlineToBackground
                as="a"
                href={statsFootnote.link.href}
                target="_blank"
                rel="noreferrer"
                targetTextColor="var(--background)"
                className="text-good"
              >
                {statsFootnote.link.label}
              </UnderlineToBackground>{" "}
              {statsFootnote.after} <span className="data">{statsFootnote.read}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
