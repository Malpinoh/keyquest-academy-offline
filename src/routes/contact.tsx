import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, pageHead } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({
    title: "Contact KeyQuest Academy",
    description: "Contact KeyQuest Academy by email or WhatsApp about typing lessons, accessibility, technical issues and suggestions.",
    path: "/contact",
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">Get in touch</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Contact KeyQuest Academy</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        Have a question, found a technical issue, or want to suggest an improvement?
        Contact the KeyQuest Academy team using either channel below.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 sm:p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
          <h2 className="mt-4 text-xl font-bold">Email support</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Send questions, feedback, accessibility requests or reports about a problem on the website.
          </p>
          <a className="mt-5 inline-flex max-w-full break-all rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground" href={`mailto:${CONTACT_EMAIL}`}>
            Email KeyQuest Academy
          </a>
          <p className="mt-2 break-all text-sm text-muted-foreground">{CONTACT_EMAIL}</p>
        </div>

        <div className="rounded-2xl border bg-card p-6 sm:p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-5 w-5" /></span>
          <h2 className="mt-4 text-xl font-bold">WhatsApp support</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Prefer messaging? Start a WhatsApp conversation with the KeyQuest Academy contact.
          </p>
          <a
            className="mt-5 inline-flex rounded-lg border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary/5"
            href={`https://wa.me/${CONTACT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
          </a>
          <p className="mt-2 text-sm text-muted-foreground">+234 816 894 0582</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-muted/50 p-5">
        <h2 className="font-semibold">When reporting an issue</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Tell us which page or feature you were using.</li>
          <li>Describe what you expected and what happened instead.</li>
          <li>Include your device and browser when reporting a technical or display issue.</li>
          <li>Never send passwords, payment details or other sensitive information.</li>
        </ul>
      </div>
    </section>
  );
}
