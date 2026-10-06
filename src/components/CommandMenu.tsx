import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Search } from "lucide-react";

export interface MenuNote {
  title: string;
  href: string;
  date: string;
}

interface Item {
  group: "Pages" | "Notes" | "Actions";
  label: string;
  hint: string;
  href?: string;
  run?: () => void;
}

const GROUPS = ["Pages", "Notes", "Actions"] as const;

function toggleTheme() {
  // The theme button owns the icon state, so let it do the switching.
  document.querySelector<HTMLElement>('[data-key="T"]')?.click();
}

function sendEmail() {
  // Assembled on click so the address never appears whole in the page or bundle.
  window.location.href = ["mailto:faarukcan", "gmail.com"].join("@");
}

function CommandMenu({ notes }: { notes: MenuNote[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => [
    { group: "Pages", label: "Home", hint: "H", href: "/" },
    { group: "Pages", label: "About", hint: "A", href: "/about" },
    { group: "Pages", label: "Blog", hint: "B", href: "/blog" },
    ...notes.map((note) => ({ group: "Notes" as const, label: note.title, hint: note.date, href: note.href })),
    { group: "Actions", label: "Switch theme", hint: "T", run: toggleTheme },
    { group: "Actions", label: "Send an email", hint: "↗", run: sendEmail },
    { group: "Actions", label: "Open LinkedIn", hint: "↗", href: "https://linkedin.com/in/frkcn" },
    { group: "Actions", label: "Open Twitter", hint: "↗", href: "https://x.com/frkcn" },
    { group: "Actions", label: "Open Instagram", hint: "↗", href: "https://instagram.com/frkcn" },
    { group: "Actions", label: "Open GitHub", hint: "↗", href: "https://github.com/frkcn" },
  ], [notes]);

  const q = query.trim().toLowerCase();
  const matches = items.filter((item) => !q || item.label.toLowerCase().includes(q));
  const current = Math.min(active, Math.max(matches.length - 1, 0));

  const show = () => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    returnFocus.current?.focus();
  };

  const choose = (item: Item) => {
    close();
    if (item.run) return item.run();
    if (!item.href) return;
    if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener,noreferrer");
    else window.location.href = item.href;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) close();
        else show();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current, open]);

  const onInputKey = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(current + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(current - 1, 0));
    } else if (event.key === "Enter" && matches[current]) {
      event.preventDefault();
      choose(matches[current]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (query) {
        setQuery("");
        setActive(0);
      } else {
        close();
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors cursor-pointer"
      >
        <kbd className="kbd hidden sm:inline-block">⌘K</kbd>
        <span className="hidden sm:inline">for everything</span>
        <span className="sm:hidden">Menu</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start px-4 pt-[12vh] sm:pt-40 bg-ink/8 text-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-[32.5rem] bg-paper text-ink shadow-[0_24px_64px_-16px_rgb(0_0_0/0.28),0_0_0_1px_color-mix(in_srgb,var(--ink)_8%,transparent)]"
          >
            <label className="flex items-center gap-3 px-4 py-3.5 text-muted">
              <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={onInputKey}
                placeholder="Search pages, notes and actions"
                aria-label="Search pages, notes and actions"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-menu-list"
                aria-activedescendant={matches[current] ? `command-item-${current}` : undefined}
                className="flex-1 min-w-0 bg-transparent text-ink placeholder:text-muted outline-none"
              />
              <kbd className="kbd hidden sm:inline-block">esc</kbd>
            </label>

            <div ref={listRef} id="command-menu-list" role="listbox" className="px-2 pt-1 pb-2 max-h-[22.5rem] overflow-y-auto">
              {GROUPS.map((group) => {
                const groupItems = matches
                  .map((item, index) => ({ item, index }))
                  .filter(({ item }) => item.group === group);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group} role="group" aria-label={group}>
                    <div className="px-2 pt-2.5 pb-1 text-xs text-muted">{group}</div>
                    {groupItems.map(({ item, index }) => (
                      <div
                        key={item.label}
                        id={`command-item-${index}`}
                        role="option"
                        aria-selected={index === current}
                        onMouseMove={() => setActive(index)}
                        onClick={() => choose(item)}
                        className={`flex justify-between items-baseline gap-6 px-2 py-1.5 cursor-pointer ${index === current ? "bg-chip" : ""}`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="shrink-0 text-xs text-muted tabular-nums">{item.hint}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
              {matches.length === 0 && (
                <p className="px-2 py-5 text-muted">
                  Nothing matches "{query}". Try a page name or a word from a note title.
                </p>
              )}
            </div>

            <div className="hidden sm:flex gap-4 px-4 py-2.5 bg-code text-xs text-muted">
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandMenu;
