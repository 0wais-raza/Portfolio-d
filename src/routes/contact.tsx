import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { usePortfolio } from "@/lib/store";
import { SplitHeading, Reveal } from "@/components/Motion";
import { DrawnBracket } from "@/components/DrawnSvg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Muhammad Owais Raza" },
      {
        name: "description",
        content:
          "Start a project with Muhammad Owais Raza. Send a brief through the terminal and get a reply within one working day.",
      },
      { property: "og:title", content: "Contact — Muhammad Owais Raza" },
      {
        property: "og:description",
        content: "Send a project brief to Muhammad Owais Raza.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const profile = usePortfolio((s) => s.profile);
  const addInquiry = usePortfolio((s) => s.addInquiry);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setBusy(true);
    try {
      await addInquiry(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Message could not be sent — check your email address and try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary/60";

  return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-36 sm:px-8">
      <div className="text-center">
        <span className="mono-label text-primary">Initiate connection</span>
        <SplitHeading
          as="h1"
          type="chars"
          stagger={0.03}
          className="mt-5 font-display text-[clamp(2.5rem,9vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter"
        >
          Let's build
        </SplitHeading>
      </div>

      <Reveal className="mt-14">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="flex items-center gap-2 border-b border-border bg-surface-high/60 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-primary/60" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
            <span className="mono-label ml-3 truncate text-muted-foreground/70">
              terminal — owais@portfolio — bash
            </span>
          </div>

          <div className="space-y-5 p-6 font-mono text-sm sm:p-9">
            <div className="flex flex-wrap gap-3">
              <span className="text-primary">visitor@web:~$</span>
              <span>whoami</span>
            </div>
            <p className="leading-relaxed text-muted-foreground">{profile.bio}</p>

            <div className="flex flex-wrap gap-3">
              <span className="text-primary">visitor@web:~$</span>
              <span>connect --method "email"</span>
            </div>

            <form
              onSubmit={submit}
              className="space-y-5 rounded-2xl border border-primary/20 bg-background/50 p-5 sm:p-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="c-name" className="mono-label block text-primary">
                    Enter name
                  </label>
                  <input
                    id="c-name"
                    className={field}
                    placeholder="..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-email" className="mono-label block text-primary">
                    Enter email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    className={field}
                    placeholder="you@studio.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="c-msg" className="mono-label block text-primary">
                  Enter message
                </label>
                <textarea
                  id="c-msg"
                  rows={4}
                  className={`${field} resize-none`}
                  placeholder="How can I help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                data-magnetic
                disabled={busy}
                className="mono-label rounded-full border border-primary px-7 py-3 text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
              >
                {busy ? "Sending…" : "Execute send"}
              </button>
            </form>

            <div className="flex items-center gap-3 text-success">
              <span className="h-2 w-2 rounded-full bg-success caret-blink" />
              <span className="text-xs sm:text-sm">
                {sent
                  ? "Signal received — your email app is opening with the message."
                  : "System ready: listening for incoming signals..."}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {[
          { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
          { k: "GitHub", v: "@owaisraza", href: profile.github },
          { k: "Insta", v: "@itz_professionalOfficial", href: profile.insta },
        ].map((c, i) => (
          <Reveal key={c.k} delay={i * 0.07}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="glass glass-hover block h-full rounded-3xl p-6"
            >
              <p className="mono-label text-primary">{c.k}</p>
              <p className="mt-3 break-all text-sm text-muted-foreground">{c.v}</p>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <DrawnBracket className="h-24 w-24 opacity-60" />
      </div>
    </div>
  );
}
