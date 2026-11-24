import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SOCIAL_PREVIEW_IMAGE } from "../lib/site";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { themeInitScript } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-primary">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold">This key isn't on our keyboard</h1>
      <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link to="/">Go home</Link></Button>
        <Button asChild variant="outline"><Link to="/typing-test">Take a typing test</Link></Button>
        <Button asChild variant="outline"><Link to="/resources">Browse guides</Link></Button>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <section className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">This page didn't load</h1>
      <p className="mt-2 text-muted-foreground">Something went wrong. Try again or head back home.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
        <Button asChild variant="outline"><a href="/">Go home</a></Button>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KeyQuest Academy" },
      { property: "og:site_name", content: "KeyQuest Academy" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: SOCIAL_PREVIEW_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "KeyQuest Academy — Learn to Type. Level Up. Master Your Keyboard." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_PREVIEW_IMAGE },
      { name: "theme-color", content: "#252d27" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4924684988485006"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isTypingTest = pathname === "/typing-test";
  const isClassroom = /^\/(learn|games?|play)(\/|$)/.test(pathname) || isTypingTest;
  const isLesson = /^\/learn(\/|$)/.test(pathname);
  return (
    <QueryClientProvider client={queryClient}>
      <div className={isLesson || isTypingTest ? "flex h-dvh flex-col overflow-hidden" : "flex min-h-screen flex-col"}>
        {!isClassroom && <SiteHeader />}
        <main id="main" className={isLesson || isTypingTest ? "min-h-0 flex-1 overflow-hidden" : "flex-1"}>
          <Outlet />
        </main>
        {!isClassroom && <SiteFooter />}
      </div>
    </QueryClientProvider>
  );
}
