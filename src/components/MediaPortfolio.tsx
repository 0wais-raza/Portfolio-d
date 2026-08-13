import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePortfolio, type Media } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { SplitHeading, Reveal } from "@/components/Motion";

function Lightbox({ item, onClose }: { item: Media; onClose: () => void }) {
  const isVideo = /youtube|vimeo|\.mp4|\.webm/i.test(item.url);
  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center bg-background/85 p-4 backdrop-blur-xl animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-4xl overflow-hidden rounded-3xl"
      >
        {isVideo ? (
          <div className="aspect-video w-full bg-surface-high">
            {/\.(mp4|webm)$/i.test(item.url) ? (
              <video src={item.url} controls autoPlay className="h-full w-full" />
            ) : (
              <iframe
                src={item.url}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        ) : (
          <div className="grid max-h-[62vh] min-h-[38vh] w-full place-items-center bg-surface-high md:max-h-[68vh]">
            <img
              src={item.url}
              alt={item.title}
              className="max-h-[56vh] w-auto max-w-full object-contain md:max-h-[62vh]"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-black uppercase tracking-tight">
              {item.title}
            </h3>
            {item.caption ? (
              <p className="mt-2 text-sm text-muted-foreground">{item.caption}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mono-label shrink-0 rounded-full border border-border px-5 py-2 text-muted-foreground transition-colors hover:text-primary"
          >
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );

  // position:fixed breaks inside ScrollSmoother's transformed #smooth-content
  // (fixed behaves like absolute there), so the dialog would float far off-screen
  // when opened after scrolling. Render it on <body> instead. Client-only.
  if (typeof document === "undefined") return null;
  return createPortal(dialog, document.body);
}

/** YouTube/Vimeo embeds expose a thumbnail; direct files fall back to the grain. */
function VideoPoster({ url }: { url: string }) {
  const yt = url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{6,})/);
  if (!yt) return null;
  return (
    <img
      src={`https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`}
      alt=""
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
    />
  );
}

function Grid({
  items,
  kind,
  onOpen,
}: {
  items: Media[];
  kind: "image" | "video";
  onOpen: (m: Media) => void;
}) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = grid.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-media-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.86, rotateX: 14, autoAlpha: 0.2 },
          {
            scale: 1,
            rotateX: 0,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 55%", scrub: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [items.length]);

  if (items.length === 0)
    return (
      <p className="text-sm text-muted-foreground">Nothing published in this collection yet.</p>
    );

  return (
    <div
      ref={grid}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: "1200px" }}
    >
      {items.map((m, i) => (
        <Reveal key={m.id} delay={i * 0.06}>
          <button
            data-media-card
            type="button"
            data-magnetic
            onClick={() => onOpen(m)}
            className="glass glass-hover group block w-full overflow-hidden rounded-3xl p-3 text-left"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface-high">
              {kind === "image" ? (
                <img
                  src={m.url}
                  alt={m.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="relative grid h-full w-full place-items-center bg-surface-high grid-noise">
                  <VideoPoster url={m.url} />
                  <span className="absolute grid h-16 w-16 place-items-center rounded-full border border-primary/60 bg-background/50 text-xl text-primary backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-[var(--glow-cyan)]">
                    ▶
                  </span>
                  <span className="mono-label absolute bottom-3 left-3 rounded-full bg-background/70 px-3 py-1 text-primary opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                    Play
                  </span>
                </div>
              )}
            </div>
            <div className="px-2 pb-1 pt-4">
              <h3 className="truncate font-display text-lg font-black uppercase tracking-tight">
                {m.title}
              </h3>
              <p className="mono-label mt-2 truncate text-muted-foreground">
                {m.caption || (kind === "image" ? "Still" : "Motion")}
              </p>
            </div>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

export function MediaPortfolio() {
  const images = usePortfolio((s) => s.images);
  const videos = usePortfolio((s) => s.videos);
  const hydrated = useHydrated();
  const [active, setActive] = useState<Media | null>(null);

  return (
    <>
      <section
        id="image-portfolio"
        className="relative z-10 mx-auto max-w-[1440px] scroll-mt-28 px-5 py-24 sm:px-8 lg:px-12"
      >
        <span className="mono-label text-primary">Gallery — Stills</span>
        <SplitHeading
          type="words"
          className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter"
        >
          Image Portfolio
        </SplitHeading>
        <div className="mt-12">
          <Grid items={hydrated ? images : images.slice(0, 3)} kind="image" onOpen={setActive} />
        </div>
      </section>

      <section
        id="video-portfolio"
        className="relative z-10 mx-auto max-w-[1440px] scroll-mt-28 px-5 py-24 sm:px-8 lg:px-12"
      >
        <span className="mono-label text-primary">Showreel — Motion</span>
        <SplitHeading
          type="words"
          className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter"
        >
          Video Portfolio
        </SplitHeading>
        <div className="mt-12">
          <Grid items={hydrated ? videos : videos.slice(0, 3)} kind="video" onOpen={setActive} />
        </div>
      </section>

      {active ? <Lightbox item={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
