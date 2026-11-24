import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CONTACT_EMAIL, pageHead } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({
    title: "Privacy Policy",
    description: "Learn how KeyQuest Academy handles typing practice data, browser storage, contact messages and advertising technologies.",
    path: "/privacy",
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="prose-kq mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">Site information</p>
      <h1 className="mt-3 text-4xl font-extrabold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: November 9, 2026</p>

      <p>
        This Privacy Policy explains how KeyQuest Academy handles information when you visit
        the website and use its typing lessons, tests, games and learning guides. It also
        explains the advertising technologies that may be used if advertisements are enabled.
      </p>

      <h2>Information you enter while practising</h2>
      <p>
        Text entered into the typing test, lessons and games is processed in your browser to
        run the activity and calculate results. KeyQuest Academy does not ask you to create
        an account to use these practice features. Do not type passwords, financial details
        or other sensitive personal information into practice text fields.
      </p>

      <h2>Practice progress stored on your device</h2>
      <p>
        Where browser storage is available, KeyQuest Academy saves practice summaries and
        preferences in local storage on your device. This may include session type, date,
        words per minute, accuracy, errors, game scores, lesson completion, recently opened
        lessons, mistake patterns, theme preference and daily practice goal. This information
        is used to show your progress and is not currently synchronised to a KeyQuest user
        account. Anyone who can access your browser profile may also be able to view its
        locally stored information.
      </p>
      <p>
        You can clear saved practice information using the Reset progress control on the
        Progress page or by clearing this website's data in your browser settings. If browser
        storage is unavailable, some progress may not remain after you leave or reload the site.
      </p>

      <h2>Contact messages</h2>
      <p>
        If you contact us by email or WhatsApp, the information you choose to send
        (such as your name, contact details and message) is handled by the relevant
        email or messaging provider and may be available to us so we can respond. Please
        avoid sending sensitive information. Those providers process information under
        their own privacy policies and terms.
      </p>
      <p>
        Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the
        WhatsApp option on our <a href="/contact">Contact page</a>.
      </p>

      <h2>Cookies, advertising and third-party services</h2>
      <p>
        KeyQuest Academy may use third-party advertising services, including Google AdSense,
        to display advertisements if and when advertising is enabled on the website. At the
        time this policy is updated, advertising spaces may be present in the site layout;
        this does not by itself mean that live advertisements are being served.
      </p>
      <p>
        If Google advertising is enabled, Google and its advertising partners may use cookies,
        device identifiers, IP address and similar technologies to deliver, measure and
        personalise advertisements, detect invalid traffic and prevent fraud. The information
        and technologies used can depend on the advertising configuration, your location
        and your consent choices. Third-party vendors, including Google, may use information
        about visits to this and other websites to provide advertising services.
      </p>
      <p>
        You can learn about how Google uses information from sites and apps that use its
        services at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Google's partner-sites policy
        </a>.
        You can review or change Google advertising personalisation choices at{" "}
        <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>.
        You can also learn about broader advertising opt-out choices at{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          YourAdChoices
        </a>.
      </p>
      <p>
        Where applicable law or a third-party advertising platform requires consent before
        certain cookies or personalised advertising are used, the relevant consent choices
        must be provided and respected. You can also control cookies through your browser
        settings, although disabling some cookies or storage may affect site functionality.
      </p>

      <h2>Hosting, fonts and technical information</h2>
      <p>
        Our hosting, content-delivery, security and font providers may process technical
        information needed to deliver and protect the website. This can include IP address,
        browser and device details, requested pages, timestamps and server logs. For example,
        the site may load fonts from Google Fonts. These providers handle information under
        their own privacy terms.
      </p>

      <h2>Children and learners</h2>
      <p>
        KeyQuest Academy provides general typing education. We do not require learners to
        submit personal details to begin practising. Children should use the site with
        appropriate guidance from a parent, guardian or teacher and should not share
        personal or sensitive information in practice fields or messages.
      </p>

      <h2>Data security and retention</h2>
      <p>
        Practice data saved in local storage remains in the browser profile until it is
        reset or the website data is cleared. Messages sent through email or WhatsApp may
        remain with those services according to their retention settings and policies.
        We take reasonable care with information we receive, but no website, device or
        internet transmission can be guaranteed completely secure.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy when the website's features, advertising services or
        data practices change. The “Last updated” date at the top will be revised when
        material changes are made. Please review this page periodically.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through the
        WhatsApp contact listed on the <a href="/contact">Contact page</a>.
      </p>
    </article>
  );
}
