import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gộp class, dedupe class Tailwind trùng nhóm — chuẩn shadcn/fancy cần. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Chia text kiểu "abc {link} def" thành các đoạn để render link inline */
/**
 * Tách text thành đoạn thường và link. Cú pháp: {nhãn} hoặc {nhãn|href}.
 */
export function splitLinks(text: string) {
  return text.split(/(\{[^}]+\})/g).map((part) => {
    if (!part.startsWith("{") || !part.endsWith("}")) {
      return { link: false as const, text: part };
    }
    const [label, href] = part.slice(1, -1).split("|");
    return { link: true as const, text: label, href };
  });
}
