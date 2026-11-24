import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/lessons", label: "Lessons" },
  { to: "/typing-test", label: "Typing Test" },
  { to: "/games", label: "Games" },
  { to: "/progress", label: "Progress" },
  { to: "/resources", label: "Resources" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#333b32] bg-[#252d27] text-[#f5f0df] shadow-[0_3px_12px_rgba(20,25,20,.22)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <div className="mx-auto flex min-h-[4.5rem] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 rounded-md" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#78816d] bg-[#3b4739] text-[#f2d875] shadow-inner"><Logo className="h-6 w-6" /></span>
          <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">KeyQuest <span className="text-[#e7cf72]">Academy</span><span className="mt-0.5 block font-sans text-[9px] font-semibold uppercase tracking-[.2em] text-[#c2c9b8]">Typing & keyboard skills</span></span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => <Link key={item.to} to={item.to} className="rounded-md border border-transparent px-3 py-2 text-[13px] font-bold text-[#e0e4d9] transition hover:border-[#69735f] hover:bg-[#354137]" activeProps={{ className: "border-[#8e9a76] bg-[#e2cd76] !text-[#263027] shadow-inner" }}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className="rounded-md border border-[#65705f] bg-[#303a31] p-1"><ThemeToggle /></div>
          <Link to="/lessons" className="hidden items-center gap-2 rounded-md border border-[#f4df8b] bg-[#e4cd70] px-3.5 py-2.5 text-sm font-extrabold text-[#283126] shadow-[inset_0_1px_rgba(255,255,255,.55),0_2px_0_#9c8740] transition hover:bg-[#f0dc8a] sm:inline-flex">Start Lesson <ArrowUpRight className="h-4 w-4" /></Link>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#65705f] bg-[#303a31] hover:bg-[#3b4739] xl:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="Mobile" className="border-t border-[#596452] bg-[#252d27] px-4 py-4 xl:hidden"><ul className="mx-auto grid max-w-[1440px] gap-1 sm:px-2">{NAV.map((item) => <li key={item.to}><Link to={item.to} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-md border border-transparent px-4 py-3 text-sm font-bold text-[#e0e4d9] hover:border-[#69735f] hover:bg-[#354137]" activeProps={{ className: "border-[#8e9a76] bg-[#e2cd76] !text-[#263027]" }}>{item.label}<ArrowUpRight className="h-4 w-4 opacity-60" /></Link></li>)}<li className="pt-2"><Link to="/lessons" onClick={() => setOpen(false)} className="flex items-center justify-center rounded-md border border-[#f4df8b] bg-[#e4cd70] px-4 py-3 text-sm font-extrabold text-[#283126]">Start lesson <ArrowUpRight className="ml-2 h-4 w-4" /></Link></li></ul></nav>}
    </header>
  );
}
