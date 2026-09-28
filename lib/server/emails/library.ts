import { brandedEmail, html } from "@/lib/server/emails/layout";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

/** Sends a member a link that opens the members' library on their device. */
export function libraryEmail(name: string | null, link: string) {
  const first = name?.split(" ")[0];
  const heading = first ? `Here's your library link, ${first}.` : "Here's your library link.";
  const content = [
    html.kicker("Members' library"),
    html.heading(heading),
    html.para("Open it on the device you want to read on and it will remember you. The link replaces any older ones."),
    html.button("Open the library", link),
    html.subheading("What's inside"),
    html.list(resources.map((r) => r.title)),
    html.signoff(),
  ].join("\n");
  const footer = "You asked for this link on the FCM Intelligence website. If that wasn't you, you can ignore this email.";
  const text = [heading, "", link, "", "What's inside:", ...resources.map((r) => `- ${r.title}`), "", "Mikesh", `${site.owner}`, "", footer].join("\n");
  return {
    subject: "Your FCM members' library",
    html: brandedEmail({ preheader: "Every checklist and guide, in one place.", content, footer }),
    text,
  };
}
