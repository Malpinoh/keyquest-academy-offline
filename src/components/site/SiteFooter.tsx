import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { GUIDES } from "@/content/guides";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#414b3e] bg-[#252d27] text-[#f1eedf]">
      <div className="mx-auto grid max-w-[1440px] gap-9 px-4 py-11 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-3 font-display font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#78816d] bg-[#3b4739] text-[#f2d875]"><Logo className="h-6 w-6" /></span>
            <span>KeyQuest <span className="text-[#e7cf72]">Academy</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#c5cbbb]">A practical typing classroom for building accuracy, confidence and keyboard skills—one lesson at a time.</p>
        </div>
        <FooterCol title="Training room">
          <FooterLink to="/typing-test">Typing speed test</FooterLink>
          <FooterLink to="/lessons">Beginner lessons</FooterLink>
          <FooterLink to="/lessons">Lesson curriculum</FooterLink>
          <FooterLink to="/games">Typing games</FooterLink>
          <FooterLink to="/progress">Progress reports</FooterLink>
        </FooterCol>
        <FooterCol title="Study library">
          {GUIDES.map((guide) => <li key={guide.slug}><Link to="/resources/$slug" params={{ slug: guide.slug }} className="text-sm text-[#c5cbbb] transition hover:text-[#f2d875] hover:underline">{guide.shortTitle}</Link></li>)}
          <li><Link to="/resources" className="text-sm font-bold text-[#e7cf72] hover:underline">All guides</Link></li>
        </FooterCol>
        <FooterCol title="KeyQuest">
          <FooterLink to="/about">About the academy</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/privacy">Privacy policy</FooterLink>
          <FooterLink to="/terms">Terms of use</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-[#414b3e] bg-[#1e2520] px-4 py-4 text-center text-xs text-[#aeb7a7]">
        © {new Date().getFullYear()} KeyQuest Academy. Independent typing education. Not affiliated with Mavis Beacon.
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return <div><h2 className="text-xs font-extrabold uppercase tracking-[.16em] text-[#e7cf72]">{title}</h2><ul className="mt-4 grid gap-2.5">{children}</ul></div>;
}

function FooterLink({ to, children }: { to: "/typing-test" | "/learn" | "/lessons" | "/games" | "/progress" | "/about" | "/contact" | "/privacy" | "/terms"; children: ReactNode }) {
  return <li><Link to={to} className="text-sm text-[#c5cbbb] transition hover:text-[#f2d875] hover:underline">{children}</Link></li>;
}
