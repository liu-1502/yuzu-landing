import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Hiện dần khi vào khung nhìn — cơ chế của dev.yuzu.money.
 *
 * Trên bản dev mỗi khối mang sẵn `style="opacity:0; transform: translateY(40px)"`
 * rồi được gỡ ra khi cuộn tới. Các mức lệch họ dùng: 40px cho khối tiêu đề, 24px
 * cho thẻ vault, 18px cho ô KPI, 16px cho bước Path In, và -14px theo TRỤC X cho
 * từng dòng Protection.
 *
 * `once` mặc định true: hiện rồi thì thôi, không mờ lại khi cuộn ngược — cuộn lên
 * cuộn xuống mà khối cứ nhấp nháy thì rất nhiễu.
 */
export function Reveal({
  children,
  y = 40,
  x = 0,
  delay = 0,
  className,
}: {
  children: ReactNode;
  y?: number;
  x?: number;
  /** Giây. Dùng để rải lệch pha cho các phần tử cùng một hàng. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Không có IntersectionObserver hoặc người dùng tắt animation thì hiện luôn.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : `translate(${x}px, ${y}px)`,
    transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.22,.61,.36,1) ${delay}s`,
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
