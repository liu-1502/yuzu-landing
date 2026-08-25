import { useEffect, useState } from "react";
import { stats } from "@/data/content";
import { cn } from "@/lib/utils";
import { LiquidSurface } from "@/components/ui/LiquidSurface";

/** prefers-reduced-motion, giống useReducedMotion của trang gốc */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

type Stat = (typeof stats)[number];

export function StatBox({ stat, active = true }: { stat: Stat; active?: boolean }) {
  const reduced = useReducedMotion();
  const uid = stat.label.replace(/[^a-z]/gi, "");

  return (
    <div
      tabIndex={0}
      style={{ minHeight: 132 }}
      className="stat-box group relative rounded-lg bg-surface-2 p-4"
    >
      {stat.level !== undefined && (
        <LiquidSurface
          level={stat.level}
          active={active}
          tone="var(--liquid-back)"
          uid={uid}
          reduced={reduced}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="microlabel">{stat.label}</span>
        </div>
        <div
          className={cn(
            "data stat-value mt-2.5 text-[26px] font-semibold leading-none",
            stat.accent ? "text-accent" : "text-foreground",
          )}
        >
          <span>{stat.value}</span>
        </div>
      </div>

      {/* tooltip breakdown */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-64 -translate-x-1/2 rounded-md border border-line-solid bg-surface p-3.5 opacity-0 shadow-[0_16px_40px_color-mix(in_srgb,var(--foreground)_16%,transparent)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="mb-2.5 flex items-baseline justify-between gap-2">
          <span className="microlabel">Breakdown</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {stat.rows.map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-[6px] w-[6px] shrink-0 rounded-[2px]"
                    style={{ background: r.color ?? "var(--faint)" }}
                  />
                  <span className="truncate text-[12.5px] text-muted-foreground">{r.label}</span>
                  {r.attested && <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-good" />}
                </span>
                <span className="data shrink-0 text-[12.5px] font-medium text-foreground">{r.value}</span>
              </div>
              {r.children && (
                <div className="mt-1 flex flex-col gap-1 pl-4">
                  {r.children.map((c) => (
                    <div key={c.label} className="flex items-center justify-between">
                      <span className="data text-[11.5px] text-faint">{c.label}</span>
                      <span className="data text-[11.5px] text-muted-foreground">{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-line-solid pt-2.5 text-[10.5px] leading-[1.5] text-faint">
          {stat.note}
        </p>
        <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-line-solid bg-surface" />
      </div>
    </div>
  );
}
