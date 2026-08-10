import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const photo = usePortfolio((s) => s.profile.photo);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-2xl" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 lg:px-12 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          to="/"
          data-magnetic
          className="flex min-w-0 items-center gap-3 font-display text-lg font-black tracking-tighter sm:text-xl"
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-primary/40 object-cover"
              style={{ borderRadius: "50%" }}
            />
          ) : null}
          <span className="truncate">
            OWAIS<span className="text-primary">_</span>RAZA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="mono-label text-muted-foreground transition-colors duration-300 hover:text-primary data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            data-magnetic
            className="mono-label rounded-full border border-primary/40 px-5 py-2 text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Contact Me
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full border border-border p-2.5 md:hidden"
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <span
              className={`block h-px w-full bg-foreground transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-foreground transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-foreground transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`glass mx-4 overflow-hidden rounded-3xl transition-all duration-500 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {[...links, { to: "/contact", label: "Contact Me" } as const].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mono-label rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
