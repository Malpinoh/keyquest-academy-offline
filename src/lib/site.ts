// Desktop/offline app configuration. No website host or canonical URL is required.
export const SITE_NAME = "KeyQuest Academy";
export const SITE_TAGLINE = "Learn to Type. Level Up. Master Your Keyboard.";
export const SITE_URL: string = (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(/\/$/, "") || "";
export const SOCIAL_PREVIEW_IMAGE = "/keyquest-social-preview.png";

// Public support channels displayed on the Contact page.
export const CONTACT_EMAIL = "malpinoh1@gmail.com";
export const CONTACT_WHATSAPP = "2348168940582";

export const STATIC_PATHS = [
  "/",
  "/typing-test",
  "/lessons",
  "/games",
  "/resources",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export function pageHead(opts: { title: string; description: string; path: string; type?: string }) {
  const url = `${SITE_URL}${opts.path}`;
  const fullTitle = opts.path === "/" ? `${SITE_NAME} — ${SITE_TAGLINE}` : `${opts.title} | ${SITE_NAME}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: opts.description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:image", content: SOCIAL_PREVIEW_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "KeyQuest Academy — Learn to Type. Level Up. Master Your Keyboard." },
      ...(SITE_URL ? [{ property: "og:url", content: url }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_PREVIEW_IMAGE },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: opts.description },
    ],
    links: SITE_URL ? [{ rel: "canonical", href: url }] : [],
  };
}
