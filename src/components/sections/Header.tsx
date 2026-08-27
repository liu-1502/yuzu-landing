import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { nav } from "@/data/content";
import { ArrowUpRight, ChevronDown, Menu, X } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

/**
 * Một link của nav có thể là ba loại: route (`/alpha`), neo trong trang
 * (`#security`) hoặc link ngoài. Neo trong trang chỉ chạy được khi đang ở
 * landing; đứng ở trang sản phẩm thì phải điều hướng về `/` kèm hash, và phải
 * đi qua <Link> để react-router gắn basename (`/yuzu-landing/` trên Pages).
 */
function NavA({
  href,
  external,
  onClick,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const onLanding = useLocation().pathname === "/";

  if (external || href === "#") {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    if (onLanding) {
      return (
        <a href={href} onClick={onClick} className={className}>
          {children}
        </a>
      );
    }
    return (
      <Link to={{ pathname: "/", hash: href }} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface">
      <div className="px-6 lg:px-[60px]">
        <nav className="mx-auto flex h-16 max-w-[1024px] items-center justify-between">
          <Link to="/" aria-label="Yuzu" className="squeeze">
            <Wordmark className="h-8" />
          </Link>

          <ul className="hidden items-center gap-5 md:flex lg:gap-7">
            <li>
              <div
                className="relative"
                onMouseEnter={() => setOpenProducts(true)}
                onMouseLeave={() => setOpenProducts(false)}
              >
                <button
                  type="button"
                  onClick={() => setOpenProducts((v) => !v)}
                  className="group/nav relative flex items-center gap-1 py-1 text-[13.5px] font-medium text-foreground transition-colors duration-150"
                >
                  Products
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      openProducts && "rotate-180",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ease-out",
                      openProducts ? "w-full" : "w-0",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "absolute left-1/2 top-full z-50 w-[268px] -translate-x-1/2 pt-3 transition-all duration-150",
                    openProducts
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  )}
                >
                  <ul className="overflow-hidden rounded-lg bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.28)]">
                    {nav.products.map((p) => (
                      <li key={p.name}>
                        <NavA
                          href={p.href}
                          onClick={() => setOpenProducts(false)}
                          className="flex items-start gap-2.5 rounded-md px-2.5 py-2 transition-colors duration-150 hover:bg-surface-2 focus-visible:bg-surface-2"
                        >
                          <span
                            className="mt-[7px] size-2 shrink-0 rounded-[3px]"
                            style={{ background: p.color }}
                          />
                          <span className="min-w-0">
                            <span className="block text-[13.5px] font-medium text-foreground">
                              {p.name}
                            </span>
                            <span className="mt-px block text-[12px] leading-[1.4] text-muted-foreground">
                              {p.desc}
                            </span>
                          </span>
                        </NavA>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {nav.links.map((l) => (
              <li key={l.label}>
                <NavA
                  href={l.href}
                  external={l.external}
                  className="group/nav relative flex items-center gap-1 py-1 text-[13.5px] font-medium text-foreground transition-colors duration-150"
                >
                  {l.label}
                  {l.external && (
                    <ArrowUpRight className="size-3.5 opacity-70" />
                  )}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-accent transition-all duration-300 ease-out group-hover/nav:w-full" />
                </NavA>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <a
              href="#"
              className="launch-btn inline-flex h-9 min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-[14px] font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Launch app
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-foreground"
              onClick={() => setOpenMenu((v) => !v)}
              aria-label="Toggle menu"
            >
              {openMenu ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>

      {openMenu && (
        <div className="border-t border-line-solid bg-surface md:hidden">
          <ul className="flex flex-col px-6 py-3">
            {nav.products.map((p) => (
              <li key={p.name}>
                <NavA
                  href={p.href}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2.5 py-2.5 text-[14px] font-medium"
                >
                  <span
                    className="size-2 rounded-[3px]"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </NavA>
              </li>
            ))}
            {nav.links.map((l) => (
              <li key={l.label}>
                <NavA
                  href={l.href}
                  external={l.external}
                  onClick={() => setOpenMenu(false)}
                  className="block py-2.5 text-[14px] font-medium text-muted-foreground"
                >
                  {l.label}
                </NavA>
              </li>
            ))}
            <li className="pb-3 pt-3">
              <a
                href="#"
                className="launch-btn flex h-9 min-h-9 items-center justify-center rounded-sm px-4 py-1.5 text-[14px] font-medium transition-colors"
              >
                Launch app
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
