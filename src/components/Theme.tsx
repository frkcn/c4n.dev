import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const Theme = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-key="T"
      aria-keyshortcuts="T"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex items-center justify-center w-6 h-6 text-muted hover:text-ink transition-colors cursor-pointer"
    >
      {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
}

export default Theme;
