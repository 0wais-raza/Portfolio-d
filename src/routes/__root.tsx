import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { MagneticCursor } from "@/components/MagneticCursor";
import { SmoothScroll, refreshScrollTriggers } from "@/components/SmoothScroll";
import { usePortfolio } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-black tracking-tighter text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="mono-label inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Transient teardown errors (e.g. GSAP pin-spacers racing React's removeChild)
// clear up on retry. Auto-retry the FIRST failure so visitors never see the
// dead-end screen for a hiccup; only show it for back-to-back failures within
// the window, so a genuinely broken page can't loop forever.
let autoRecoveryCount = 0;
let lastAutoRecoveryAt = 0;
const AUTO_RECOVERY_WINDOW_MS = 60_000;

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    const now = Date.now();
    if (now - lastAutoRecoveryAt > AUTO_RECOVERY_WINDOW_MS) autoRecoveryCount = 0;
    lastAutoRecoveryAt = now;
    autoRecoveryCount += 1;

    if (autoRecoveryCount > 1) return;
    const id = window.setTimeout(() => {
      void router.invalidate();
      reset();
    }, 0);
    return () => window.clearTimeout(id);
  }, [reset, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mono-label inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="mono-label inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Muhammad Owais Raza — Aesthetic Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Muhammad Owais Raza, fullstack architect building high-performance, editorial-grade web experiences.",
      },
      { name: "author", content: "Muhammad Owais Raza" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#030712" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/me.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/me.png" },
      { rel: "shortcut icon", href: "/me.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-noise opacity-40" />
      <div className="absolute -left-40 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="absolute -right-32 top-1/3 h-[38rem] w-[38rem] rounded-full bg-violet/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] left-1/3 h-[34rem] w-[34rem] rounded-full bg-primary/5 blur-[160px]" />
    </div>
  );
}

function DynamicFavicon() {
  const favicon = usePortfolio((s) => s.profile.favicon || s.profile.photo);
  useEffect(() => {
    if (!favicon) return;
    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      document.head.appendChild(
        Object.assign(document.createElement("link"), {
          rel: "icon",
        }),
      );
    link.href = favicon;
    link.type = favicon.startsWith("data:")
      ? favicon.slice(5, favicon.indexOf(";"))
      : favicon.endsWith(".svg")
        ? "image/svg+xml"
        : favicon.endsWith(".png")
          ? "image/png"
          : favicon.endsWith(".jpg") || favicon.endsWith(".jpeg")
            ? "image/jpeg"
            : favicon.endsWith(".webp")
              ? "image/webp"
              : "";
  }, [favicon]);
  return null;
}

/** Content is static (src/content/portfolio.ts) — nothing to sync.
 *  Refreshes ScrollTriggers once content is marked loaded so page height is exact. */
function ContentSync() {
  const hydrate = usePortfolio((s) => s.hydrate);
  const loaded = usePortfolio((s) => s.loaded);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Dynamic content changes page height — recompute every ScrollTrigger.
  useEffect(() => {
    if (loaded) refreshScrollTriggers();
  }, [loaded]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ContentSync />
      <DynamicFavicon />

      {/* Fixed / overlay chrome lives OUTSIDE #smooth-content so ScrollSmoother
          never transforms it out of place. */}
      <MagneticCursor />
      <Aurora />
      <SiteNav />
      <Toaster />

      <SmoothScroll>
        <main className="relative z-10">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </SmoothScroll>
    </QueryClientProvider>
  );
}
