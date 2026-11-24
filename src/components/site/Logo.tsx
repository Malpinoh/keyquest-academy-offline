export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="kq-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>
      <rect x="2" y="5" width="28" height="22" rx="6" fill="url(#kq-logo)" />
      <rect x="6" y="9" width="5" height="5" rx="1.2" fill="var(--primary-foreground)" opacity=".9" />
      <rect x="13.5" y="9" width="5" height="5" rx="1.2" fill="var(--primary-foreground)" opacity=".6" />
      <rect x="21" y="9" width="5" height="5" rx="1.2" fill="var(--primary-foreground)" opacity=".9" />
      <rect x="8" y="17.5" width="16" height="5" rx="1.2" fill="var(--primary-foreground)" opacity=".9" />
    </svg>
  );
}
