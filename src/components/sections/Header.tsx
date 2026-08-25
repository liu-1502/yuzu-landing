import { useState } from "react";
import { nav } from "@/data/content";
import { ArrowUpRight, ChevronDown, Menu, X } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

export function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface">
      <div className="px-6 lg:px-[60px]">
        <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between">
          <a href="#top" aria-label="Yuzu" className="squeeze">
            <Wordmark className="h-8" />
          </a>

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
                        <a
                          href={p.href}
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
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {nav.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group/nav relative flex items-center gap-1 py-1 text-[13.5px] font-medium text-foreground transition-colors duration-150"
                >
                  {l.label}
                  {l.external && (
                    <ArrowUpRight className="size-3.5 opacity-70" />
                  )}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-accent transition-all duration-300 ease-out group-hover/nav:w-full" />
                </a>
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
                <a
                  href={p.href}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2.5 py-2.5 text-[14px] font-medium"
                >
                  <span
                    className="size-2 rounded-[3px]"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </a>
              </li>
            ))}
            {nav.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpenMenu(false)}
                  className="block py-2.5 text-[14px] font-medium text-muted-foreground"
                >
                  {l.label}
                </a>
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
