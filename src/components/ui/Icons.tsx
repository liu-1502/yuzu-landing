/**
 * Façade icon của dự án — mọi icon UI đều là lucide (`lucide-react`).
 *
 * Giữ nguyên tên export và `className` mặc định như bản SVG viết tay trước đây,
 * nên 7 file section gọi vào không phải sửa gì. `strokeWidth` đặt lại theo từng
 * nhóm để bề dày nét khớp với bản cũ.
 *
 * Ngoại lệ duy nhất là `AccountableMark` — đó là logomark của đối tác, không phải
 * icon UI, lucide không có và cũng không nên thay.
 */
import {
  ArrowRight as LrArrowRight,
  ArrowUpRight as LrArrowUpRight,
  ChevronDown as LrChevronDown,
  ChevronLeft as LrChevronLeft,
  ChevronRight as LrChevronRight,
  ExternalLink as LrExternalLink,
  FileCheck2,
  Landmark,
  ListChecks,
  Lock,
  LogOut,
  ChartColumn,
  Clock,
  Compass,
  ContactRound,
  Mail,
  Menu as LrMenu,
  MessageCircle,
  Plus as LrPlus,
  Moon as LrMoon,
  ShieldCheck,
  Users,
  Sun as LrSun,
  X as LrX,
} from "lucide-react";

type P = { className?: string };

/* --- điều hướng / hành động --- */

export const ArrowRight = ({ className = "size-4" }: P) => (
  <LrArrowRight className={className} strokeWidth={1.9} aria-hidden />
);

export const ArrowUpRight = ({ className = "size-4" }: P) => (
  <LrArrowUpRight className={className} strokeWidth={1.9} aria-hidden />
);

export const ExternalLink = ({ className = "size-4" }: P) => (
  <LrExternalLink className={className} strokeWidth={1.9} aria-hidden />
);

export const ChevronLeft = ({ className = "size-4" }: P) => (
  <LrChevronLeft className={className} strokeWidth={2} aria-hidden />
);

export const ChevronRight = ({ className = "size-4" }: P) => (
  <LrChevronRight className={className} strokeWidth={2} aria-hidden />
);

export const ChevronDown = ({ className = "size-4" }: P) => (
  <LrChevronDown className={className} strokeWidth={2} aria-hidden />
);

export const Menu = ({ className = "size-5" }: P) => (
  <LrMenu className={className} strokeWidth={2} aria-hidden />
);

export const X = ({ className = "size-5" }: P) => (
  <LrX className={className} strokeWidth={2} aria-hidden />
);

export const Plus = ({ className = "size-4" }: P) => (
  <LrPlus className={className} strokeWidth={2} aria-hidden />
);

/* --- theme --- */

export const Sun = ({ className = "size-[18px]" }: P) => (
  <LrSun className={className} strokeWidth={2} aria-hidden />
);

export const Moon = ({ className = "size-[18px]" }: P) => (
  <LrMoon className={className} strokeWidth={2} aria-hidden />
);

/* --- ô fact trong section Products --- */

export const LockIcon = ({ className = "size-8" }: P) => (
  <Lock className={className} strokeWidth={1.6} aria-hidden />
);

export const ExitIcon = ({ className = "size-8" }: P) => (
  <LogOut className={className} strokeWidth={1.6} aria-hidden />
);

export const ShieldIcon = ({ className = "size-8" }: P) => (
  <ShieldCheck className={className} strokeWidth={1.6} aria-hidden />
);

/* --- card Concierge --- */

export const CompassIcon = ({ className = "size-[22px]" }: P) => (
  <Compass className={className} strokeWidth={1.7} aria-hidden />
);

export const IdIcon = ({ className = "size-[22px]" }: P) => (
  <ContactRound className={className} strokeWidth={1.7} aria-hidden />
);

export const ChartIcon = ({ className = "size-[22px]" }: P) => (
  <ChartColumn className={className} strokeWidth={1.7} aria-hidden />
);

export const ChatIcon = ({ className = "size-[22px]" }: P) => (
  <MessageCircle className={className} strokeWidth={1.7} aria-hidden />
);

export const UsersIcon = ({ className = "size-[22px]" }: P) => (
  <Users className={className} strokeWidth={1.7} aria-hidden />
);

export const ClockIcon = ({ className = "size-[22px]" }: P) => (
  <Clock className={className} strokeWidth={1.7} aria-hidden />
);

export const MailIcon = ({ className = "size-[22px]" }: P) => (
  <Mail className={className} strokeWidth={1.7} aria-hidden />
);

/* --- card trong section Transparency --- */

export const SolvencyIcon = ({ className = "size-[22px]" }: P) => (
  <Landmark className={className} strokeWidth={1.6} aria-hidden />
);

export const AttestIcon = ({ className = "size-[22px]" }: P) => (
  <FileCheck2 className={className} strokeWidth={1.6} aria-hidden />
);

export const WhitelistIcon = ({ className = "size-[22px]" }: P) => (
  <ListChecks className={className} strokeWidth={1.6} aria-hidden />
);

/* --- logomark đối tác (không phải icon UI, giữ SVG gốc) --- */

/** Logomark Accountable — dùng currentColor, copy path từ trang gốc. */
export function AccountableMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20.9512 20.9503"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12.6038 18.3265V19.3146C12.6038 20.2171 11.8697 20.9503 10.9682 20.9503H9.98012C9.07764 20.9503 8.3445 20.2162 8.3445 19.3146V18.3265C8.3445 17.4241 9.0786 16.6909 9.98012 16.6909H10.9682C11.8707 16.6909 12.6038 17.425 12.6038 18.3265Z" fill="currentColor" />
      <path d="M12.6048 10.9374V9.92624C12.6048 9.05359 11.8967 8.34547 11.024 8.34547H9.9272C9.05455 8.34547 8.34643 9.05359 8.34643 9.92624V10.9374C8.34643 11.8101 7.6383 12.5182 6.76566 12.5182H5.75447C4.88182 12.5182 4.1737 13.2263 4.1737 14.099V15.1958C4.1737 16.0684 4.88182 16.7766 5.75447 16.7766H6.85129C7.72393 16.7766 8.43206 16.0684 8.43206 15.1958V14.1846C8.43206 13.312 9.14018 12.6038 10.0128 12.6038H10.9384C11.811 12.6038 12.5192 13.312 12.5192 14.1846V15.1958C12.5192 16.0684 13.2273 16.7766 14.0999 16.7766H15.1968C16.0694 16.7766 16.7775 16.0684 16.7775 15.1958V14.099C16.7775 13.2263 16.0694 12.5182 15.1968 12.5182H14.1856C13.3129 12.5182 12.6048 11.8101 12.6048 10.9374Z" fill="currentColor" />
      <path d="M20.9512 9.91854V11.0317C20.9512 11.9005 20.2469 12.6048 19.3781 12.6048H18.265C17.3962 12.6048 16.6919 11.9005 16.6919 11.0317V10.0042C16.6919 9.13537 15.9876 8.4311 15.1188 8.4311H14.0922C13.2234 8.4311 12.5192 7.72682 12.5192 6.85802V5.83144C12.5192 4.96264 11.8149 4.25836 10.9461 4.25836H10.0051C9.13633 4.25836 8.43206 4.96264 8.43206 5.83144V6.85802C8.43206 7.72682 7.72778 8.4311 6.85898 8.4311H5.8324C4.9636 8.4311 4.25932 9.13537 4.25932 10.0042V11.0317C4.25932 11.9005 3.55505 12.6048 2.68625 12.6048H1.57307C0.704275 12.6048 0 11.9005 0 11.0317V9.91854C0 9.04974 0.704275 8.34547 1.57307 8.34547H2.59966C3.46846 8.34547 4.17273 7.64119 4.17273 6.77239V5.74581C4.17273 4.87701 4.87701 4.17273 5.74581 4.17273H6.77239C7.64119 4.17273 8.34547 3.46846 8.34547 2.59966V1.57307C8.34547 0.704275 9.04974 0 9.91854 0H11.0317C11.9005 0 12.6048 0.704275 12.6048 1.57307V2.59966C12.6048 3.46846 13.3091 4.17273 14.1779 4.17273H15.2044C16.0732 4.17273 16.7775 4.87701 16.7775 5.74581V6.77239C16.7775 7.64119 17.4818 8.34547 18.3506 8.34547H19.3781C20.2469 8.34547 20.9512 9.04974 20.9512 9.91854Z" fill="currentColor" />
    </svg>
  );
}
