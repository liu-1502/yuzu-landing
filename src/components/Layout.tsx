import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

/** Đổi route thì về đầu trang — trừ khi URL có hash, lúc đó nhảy tới section.
 *
 * Phải ngắm lại vài lần chứ không tin lần đầu: landing vừa mount thì Security
 * còn đang đo viewport (useStacking) và Transparency bị kéo -100svh theo nó, nên
 * vị trí của section chỉ đúng sau vài nhịp layout. */
function ScrollReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    let n = 0;
    let timer = 0;
    const aim = () => {
      // "instant" chứ không để mặc định: html có scroll-behavior smooth, mà đây là
      // lúc vừa từ trang khác sang — cuộn mượt qua gần 10.000px mất cả giây, và
      // mỗi lần ngắm lại sẽ huỷ animation cũ rồi chạy lại từ đầu.
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      if (++n < 3) timer = window.setTimeout(aim, 120);
    };
    const raf = requestAnimationFrame(aim);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <>
      <ScrollReset />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.14em]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
