import { concierge, site } from "@/data/content";
import {
  ArrowUpRight,
  ChartIcon,
  ChatIcon,
  CompassIcon,
  IdIcon,
  ClockIcon,
  MailIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/Icons";

const ASSURANCE_ICONS = { users: UsersIcon, clock: ClockIcon, shield: ShieldIcon };
/** Icon cho từng dòng, gán theo thứ tự bullet. */
const BULLET_ICONS = [CompassIcon, IdIcon, ChartIcon, ChatIcon];

export function Contact() {
  return (
    <section id="contact" className="section-tint border-t border-line-solid px-6 py-8 md:py-16 lg:px-[60px]">
      <div className="mx-auto grid max-w-[1024px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,580px)] lg:items-start lg:gap-16">
        <div>
          <span className="kicker mb-4">{concierge.kicker}</span>
          <h2 className="max-w-[20ch] text-[24px] font-semibold leading-[1.1] text-foreground md:text-[30px]">
            {concierge.title}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-muted-foreground">
            {concierge.body}
          </p>
          <ul className="mt-8 flex flex-col gap-4 border-t border-line-solid pt-8">
            {concierge.bullets.map((b, i) => {
              const Icon = BULLET_ICONS[i];
              return (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-px flex size-5 shrink-0 items-center justify-center text-[color-mix(in_srgb,var(--foreground)_38%,transparent)]">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="text-[13.5px] leading-[1.55] text-foreground">{b}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Card liên hệ: đầu xanh đậm → dải 3 ô → hàng email.
            `lg:mt-[43px]` = chiều cao kicker (27) + margin-bottom (16), để mép trên
            card trùng mép trên h2 bên trái chứ không trùng kicker. */}
        <div className="lg:mt-[43px]">
          <div className="overflow-hidden rounded-[20px] bg-surface">
            <a
              href={site.telegram}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 p-6 transition-opacity duration-300 hover:opacity-95"
              style={{
                background: "color-mix(in srgb, var(--accent) 14%, var(--surface))",
                color: "var(--mark)",
              }}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--mark)] text-[var(--accent-foreground)]">
                <ChatIcon className="size-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[22px] font-semibold leading-[1.2] tracking-[-0.01em]">
                  {concierge.cta.title}
                </span>
                <span className="mt-1.5 block max-w-[34ch] text-[13.5px] leading-[1.5] opacity-80">
                  {concierge.cta.note}
                </span>
              </span>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-5" />
              </span>
            </a>

            <ul className="grid grid-cols-3 px-2 py-7 [&>*+*]:border-l [&>*+*]:border-line-solid">
              {concierge.assurances.map((a) => {
                const Icon = ASSURANCE_ICONS[a.icon as keyof typeof ASSURANCE_ICONS];
                return (
                  <li key={a.label} className="flex flex-col items-center gap-2 px-3 text-center">
                    <Icon className="size-[22px] text-citrus" />
                    <span className="text-[13.5px] font-semibold leading-tight text-foreground">
                      {a.label}
                    </span>
                    <span className="text-[12.5px] leading-[1.45] text-muted-foreground">
                      {a.sub}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line-solid p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--mark)] text-[var(--accent-foreground)]">
                  <MailIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold leading-tight text-foreground">
                    {concierge.email.label}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-muted-foreground">
                    {concierge.email.sub}
                  </span>
                </span>
              </div>

              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-foreground underline underline-offset-2 transition-colors hover:text-accent"
              >
                {site.email}
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
