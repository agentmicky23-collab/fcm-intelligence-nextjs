import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/resources", label: "Free resources" },
      { href: "/about", label: "About Mikesh" },
    ],
  },
  {
    title: "Work with me",
    links: [
      { href: "/services", label: "Practice areas" },
      { href: "/reports", label: "Acquisition reports" },
      { href: "/contact", label: "Book a consultation" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Join free" },
    ],
  },
];

export function Footer() {
  const socials = [
    { href: site.social.linkedin, label: "LinkedIn" },
    { href: site.social.x, label: "X" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t-[3px] border-red bg-night text-white/70">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Image src="/brand/logo-full-white.png" alt="FCM First Class Managerial" width={1318} height={435} className="h-12 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Straight answers on buying and running a Post Office, from {site.owner}.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-4 text-sm">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="hover:text-white" target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-display text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.company}. FCM Intelligence is independent and is not part of or endorsed by Post Office Limited.
            <span className="mt-1 block">
              Registered in England and Wales, company no. {site.companyNumber}. Registered office: {site.registeredOffice}.
              {site.vatNumber && ` VAT no. ${site.vatNumber}.`}
            </span>
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
