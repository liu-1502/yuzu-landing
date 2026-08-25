import { useState } from "react";
import { faq } from "@/data/content";
import { Plus } from "@/components/ui/Icons";
import UnderlineToBackground from "@/components/fancy/text/underline-to-background";
import { cn, splitLinks } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-tint border-t border-line-solid px-6 py-8 md:py-16 lg:px-[60px]">
      {/* Tiêu đề bên trái, danh sách câu hỏi bên phải — xếp ngang từ lg */}
      {/* Cùng công thức cột với Concierge (Contact.tsx): khối trắng bên phải của hai
          section liền nhau phải rộng bằng nhau ở mọi bề ngang, nên cột phải cố định
          580 và cột tiêu đề bên trái ăn phần còn lại — không phải ngược lại. */}
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,580px)] lg:items-start lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="kicker mb-4">{faq.kicker}</span>
          <h2 className="text-[30px] font-semibold text-foreground md:text-[40px] md:leading-[1.15]">
            {faq.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[54ch] text-[15.5px] leading-[1.65] text-muted-foreground lg:mx-0">
            {faq.body}
          </p>
        </div>

        <div>
          <div className="rounded-lg bg-surface px-5">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-line-solid last:border-b-0">
                  <h3 className="flex">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-[15px] font-semibold text-foreground outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {item.q}
                      <Plus
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-45",
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    className={cn(
                      "grid overflow-hidden text-sm transition-all duration-300",
                      isOpen
                        ? "visible grid-rows-[1fr] opacity-100"
                        : "invisible grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0">
                      <div className="max-w-[68ch] pb-4 pt-0 text-[13.5px] leading-[1.7] text-muted-foreground">
                        {splitLinks(item.a).map((seg, k) =>
                          seg.link ? (
                            <UnderlineToBackground
                              key={k}
                              as="a"
                              href={seg.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              targetTextColor="var(--background)"
                              className="font-medium text-good"
                            >
                              {seg.text}
                            </UnderlineToBackground>
                          ) : (
                            <span key={k}>{seg.text}</span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
