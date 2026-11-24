import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL, pageHead } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({
    title: "Privacy",
    description: "How KeyQuest Academy Offline handles practice activity and locally stored progress.",
    path: "/privacy",
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="prose-kq mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">Application information</p>
      <h1 className="mt-3 text-4xl font-extrabold">Privacy</h1>
      <p className="text-sm text-muted-foreground">Last updated: November 24, 2026</p>

      <p>
        KeyQuest Academy Offline is designed to provide typing lessons, tests, games and
        learning guides on your device without requiring an online account.
      </p>

      <h2>Typing activity</h2>
      <p>
        Text you enter during lessons, tests and games is processed locally by the
        application to run each activity and calculate your results. Avoid entering
        passwords, financial details or other sensitive personal information into
        practice fields.
      </p>

      <h2>Progress saved on this device</h2>
      <p>
        The application stores practice summaries and preferences in local browser
        storage used by its desktop webview. This can include session type, date,
        words per minute, accuracy, errors, game scores, lesson completion, recently
        opened lessons, mistake patterns, theme preference and daily practice goal.
        This information is used to show your progress. It is not sent to a KeyQuest
        account and is not synchronised to a cloud service by the application.
      </p>
      <p>
        Use the Reset progress control on the Progress page to clear saved practice
        history and related practice settings. If application storage is unavailable,
        some progress may not remain after the application closes.
      </p>

      <h2>Network connections</h2>
      <p>
        Lessons, typing tests, games, guides and progress are intended to work without
        an internet connection. The application does not load advertisements, remote
        fonts, remote classroom photographs or online 3D models. It does not require
        analytics, advertising trackers, an account or a cloud database to practise.
      </p>
      <p>
        If you choose to use an external contact link, your email or messaging
        application may connect to its provider. Information you send through those
        services is handled under their own privacy terms. Contact:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Children and learners</h2>
      <p>
        KeyQuest Academy Offline provides general typing education. Learners do not
        need to submit personal details to use the practice features. Children should
        use the application with appropriate guidance from a parent, guardian or teacher.
      </p>

      <h2>Retention and security</h2>
      <p>
        Progress remains in the local application storage until it is reset or the
        application's stored data is cleared from the device. Anyone with access to
        the same device user account may be able to access that local data. Keep your
        device account protected. No storage method can be guaranteed completely secure.
      </p>

      <h2>Changes</h2>
      <p>
        This notice may be updated if the application's features or data practices
        change. The date above will be revised when material changes are made.
      </p>

      <h2>Privacy questions</h2>
      <p>
        For privacy questions, contact{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </article>
  );
}
