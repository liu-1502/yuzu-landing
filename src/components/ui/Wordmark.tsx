import { cn } from "@/lib/utils";
import { asset } from "@/data/content";

/**
 * Logo Yuzu — dùng đúng file gốc /assets/yuzu-wordmark.svg.
 * mono=true → tô một màu bằng mask (dùng cho footer), khớp bản gốc.
 */
export function Wordmark({
  className,
  mono = false,
  align = "left",
}: {
  className?: string;
  mono?: boolean;
  /** Căn lề của mask — footer lớn cần "center". */
  align?: "left" | "center";
}) {
  const src = asset("/assets/yuzu-wordmark.svg");

  if (mono) {
    const mask = {
      maskImage: `url("${src}")`,
      maskSize: "contain",
      maskRepeat: "no-repeat",
      maskPosition: `${align} center`,
      WebkitMaskImage: `url("${src}")`,
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: `${align} center`,
    } as React.CSSProperties;

    return (
      <span
        role="img"
        aria-label="Yuzu"
        className={cn(
          "squeeze block aspect-[179/60] bg-foreground transition-colors duration-500",
          className,
        )}
        style={mask}
      />
    );
  }

  return <img src={src} alt="Yuzu" className={cn("block w-auto", className)} />;
}
