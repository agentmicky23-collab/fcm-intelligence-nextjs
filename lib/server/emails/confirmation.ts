import { brandedEmail, html } from "@/lib/server/emails/layout";
import { site } from "@/lib/site";

const ps =
  "I took over my dad's branch in Oldham in 2011 with no playbook and learned every job the hard way. What I send you is what I wish someone had told me then. If you're weighing up a branch right now, hit reply and tell me about it. I read every reply myself.";

const gets = [
  "The checklists, worksheets and guides I use on every deal",
  "A short note when I publish something worth reading",
  "Straight answers from someone who runs 43 branches",
];

/** The email that confirms a new free member (double opt-in). */
export function confirmationEmail(name: string, link: string) {
  const first = name.split(" ")[0];

  const content = [
    html.kicker("Free membership"),
    html.heading(`One click and you're in, ${first}.`),
    html.para("Thanks for joining. Confirm your email address and I'll send you the checklists and guides as I release them."),
    html.button("Confirm my membership", link),
    html.small("The link works for seven days."),
    html.rule(),
    html.subheading("What you'll get"),
    html.list(gets),
    html.note(`<strong>P.S.</strong> ${ps}`),
    html.signoff(),
  ].join("\n");

  const footer =
    "You're getting this because this address was used to join FCM Intelligence. If that wasn't you, ignore this email and you won't hear from me again.";

  const text = [
    `One click and you're in, ${first}.`,
    "",
    "Thanks for joining. Confirm your email address and I'll send you the checklists and guides as I release them:",
    "",
    link,
    "",
    "The link works for seven days.",
    "",
    "What you'll get:",
    ...gets.map((g) => `- ${g}`),
    "",
    `P.S. ${ps}`,
    "",
    "Mikesh",
    `${site.owner} · Operator of 43 Post Office branches`,
    "",
    footer,
  ].join("\n");

  return {
    subject: `${first}, confirm your FCM membership`,
    html: brandedEmail({ preheader: "One click to get the checklists I use on every deal.", content, footer }),
    text,
  };
}
