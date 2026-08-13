import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/store";

export function SiteFooter() {
  const profile = usePortfolio((s) => s.profile);
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <p className="font-display text-2xl font-black tracking-tighter">
            OWAIS<span className="text-primary">_</span>RAZA
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{profile.tagline}</p>
          <p className="mono-label mt-5 text-muted-foreground">{profile.location}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="mono-label text-primary">Navigate</p>
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/projects", label: "Projects" },
            { to: "/contact", label: "Contact" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="mono-label text-primary">Elsewhere</p>
          {[
            { href: profile.github, label: "GitHub" },
            { href: profile.linkedin, label: "LinkedIn" },
            { href: profile.insta, label: "Instagram" },
            { href: `mailto:${profile.email}`, label: profile.email },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="w-fit break-all text-sm text-muted-foreground transition-all duration-500 hover:tracking-wider hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-border px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p className="mono-label text-muted-foreground">
          © {year} Muhammad Owais Raza — Built with precision
        </p>
        <button
          type="button"
          data-magnetic
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mono-label w-fit rounded-full border border-border px-5 py-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
