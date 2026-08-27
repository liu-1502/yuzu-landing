import { useEffect, useState } from "react";
import { Moon, Sun } from "./Icons";

function apply(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("yuzu-theme");
    const initial = stored ? stored === "dark" : false;
    setDark(initial);
    apply(initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    apply(next);
    localStorage.setItem("yuzu-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex h-9 w-9 items-center justify-center rounded-btn border border-line-solid text-muted-foreground transition-colors duration-150 hover:border-line-strong hover:text-foreground [&_svg]:size-[15px] ${className}`}
    >
      {/* hiện icon của theme sẽ chuyển tới, giống app.yuzu.money */}
      {dark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
