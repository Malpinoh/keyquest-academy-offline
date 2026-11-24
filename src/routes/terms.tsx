import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => pageHead({ title: "Terms of Use", description: "Terms for using KeyQuest Academy's free typing lessons, tests, games and educational guides.", path: "/terms" }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="prose-kq mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">Please read</p>
      <h1 className="mt-3 text-4xl font-extrabold">Terms of Use</h1>
      <p className="text-sm text-muted-foreground">Last updated: October 28, 2026</p>
      <p>By using KeyQuest Academy, you agree to use the site lawfully and in a way that does not interfere with other visitors or the service. If you do not agree with these terms, please do not use the site.</p>
      <h2>Educational purpose</h2>
      <p>KeyQuest offers general typing practice, learning materials and self-reported browser-based results for educational purposes. Results are estimates based on the scoring method described on the site. They are not certifications, professional assessments or guarantees of a particular typing speed or improvement.</p>
      <h2>Appropriate use</h2>
      <ul><li>Do not attempt to disrupt, overload, reverse engineer or misuse the website or its infrastructure.</li><li>Do not use the site to distribute unlawful, harmful or infringing content.</li><li>Do not rely on saved browser progress as a secure backup; it may be cleared by the user, browser or device.</li></ul>
      <h2>Content and intellectual property</h2>
      <p>Unless otherwise stated, original KeyQuest names, lesson text, guides, visual design and site code are maintained for this project. You may use the practice tools for personal learning. Do not republish substantial site content as your own or imply that KeyQuest endorses your product without permission. Third-party libraries remain subject to their own licenses.</p>
      <h2>Availability and changes</h2>
      <p>The project is provided on an “as available” basis. Features may change, be corrected or temporarily become unavailable as the site develops. We will make reasonable efforts to keep core features useful, but do not promise uninterrupted access or permanent storage of your progress.</p>
      <h2>Disclaimer and limitation</h2>
      <p>To the extent permitted by applicable law, the site and its educational content are provided without warranties of any kind. KeyQuest is not responsible for loss of locally stored progress or for decisions made solely on the basis of a typing-test result. Nothing in these terms excludes rights that cannot legally be excluded.</p>
      <h2>Changes and contact</h2>
      <p>These terms may be updated as the service develops. Continued use after a posted change means you accept the revised terms to the extent permitted by law. For contact options, visit the <a href="/contact">Contact page</a>.</p>
    </article>
  );
}
