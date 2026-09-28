// Common questions, shown on the page and given to search engines and AI assistants as structured data.
// Answers only use facts stated elsewhere on the site.

export type Faq = { q: string; a: string };

export const reportFaqs: Faq[] = [
  {
    q: "What's the difference between the Insight and Intelligence Reports?",
    a: "The Insight Report (£199 + VAT) covers 10 sections: the verdict, Post Office remuneration, online reputation, location, demographics, crime, competition, footfall, infrastructure, and risks and red flags. The Intelligence Report (£499 + VAT) has all 15 sections, adding financial analysis, staffing and hidden costs including TUPE, the future outlook, a profit improvement plan, and due diligence and negotiation guidance.",
  },
  {
    q: "What do I need to send you?",
    a: "The business name, postcode and listing link, plus anything the broker has sent you. If you have the accounts or remuneration statements, send those too and the numbers go into the report.",
  },
  {
    q: "Who checks the report?",
    a: "I check every report myself before it reaches you. I run 43 Post Office branches, and if something doesn't add up, the report says so.",
  },
  {
    q: "Can I see a report before I buy one?",
    a: "Yes. There's a complete example Intelligence Report on a fictional branch, with every section and chart.",
  },
  {
    q: "Do the prices include VAT?",
    a: "No. All prices on the site are plus VAT, which is shown as a separate line at checkout.",
  },
];

export const serviceFaqs: Faq[] = [
  {
    q: "Do you only help people buying a Post Office?",
    a: "No. There's support for every stage: buying a branch, getting set up and trained, and running one or many branches day to day. Single operators and multiple operators are both covered.",
  },
  {
    q: "How is the Branch Health Check priced?",
    a: "You choose the checks you need, priced per branch, per counter or per member of staff, as one-off costs. You can also take it monthly at 25% off, with a three-month minimum before you can cancel.",
  },
  {
    q: "Do you sell insurance?",
    a: "No. The insurance review is a free tool that checks your cover against the risks a Post Office carries. There's nothing to buy.",
  },
  {
    q: "What does Operator Training cost?",
    a: "Courses run for 1, 3, 5 or 10 days on a live counter with real customers. At one of our branches it's £100 + VAT a day. At your branch it's £200 + VAT a day plus travel.",
  },
  {
    q: "Do the prices include VAT?",
    a: "No. All prices are plus VAT.",
  },
  {
    q: "Where do I start if I'm not sure what I need?",
    a: "Book a discovery call, tell me where you are, and I'll point you to the right help.",
  },
];
