import type { ShippingLog } from "./types";

// ---------------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------------
export const NAV_LINKS: { id: "home" | "log" | "stack" | "newsletter" | "about"; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "log", label: "Shipping Log" },
  { id: "stack", label: "The Stack" },
  { id: "newsletter", label: "Newsletter" },
  { id: "about", label: "In the Arena" },
];

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const HERO = {
  eyebrow: "The Honest Tinkerer",
  headline:
    "Practical AI building without the hype, from someone who's in the trenches, not on a pedestal.",
  subhead:
    "No 47-AGI-tools threads. No \"I made $50k in a weekend\" threads. Just the messy, boring, occasionally embarrassing process of actually shipping things with AI — written down while I'm still figuring it out.",
  primaryCta: "Read the latest shipping log",
  secondaryCta: "See the minimalist stack",
};

// ---------------------------------------------------------------------------
// MANIFESTO / PROBLEM
// ---------------------------------------------------------------------------
export const MANIFESTO = {
  eyebrow: "The problem with this corner of the internet",
  title: "Twitter shows the demo. Nobody shows the dead ends.",
  body: [
    "Open any AI builder feed right now and you'll see a polished 20-second screen recording, a thread of \"10 tools that will replace your job,\" and a screenshot of a Stripe dashboard that may or may not be real.",
    "What you won't see: the three hours lost to a hallucinated API method. The wrapper that broke when the underlying model sneezed. The weekend that ended with `git reset --hard` and a beer.",
    "I got tired of that gap. So this site is the unglamorous other half — a public log of what I actually tried, what broke, and the small, boring tools that quietly carried the weight.",
  ],
  pullQuote:
    "I use Google Workspace more than any \"AI native\" platform. Sheets ship. Docs ship. They've shipped for twenty years. That's not a bug, it's the whole point.",
  pillars: [
    {
      title: "Boring tools, on purpose",
      body: "Google Sheets, a single LLM UI, simple hosting. The boring stack ships because it doesn't require a week of yak-shaving to set up.",
    },
    {
      title: "Errors are the content",
      body: "Every log entry includes the wall I hit. If a tool can't survive a public changelog of its failures, it's not a tool, it's a demo.",
    },
    {
      title: "Speed over optimization",
      body: "A working thing shipped today beats a perfect thing shipped never. I will choose the ugly 30-minute workaround every single time.",
    },
  ],
};

// ---------------------------------------------------------------------------
// THE MINIMALIST STACK — Boring Blueprint
// ---------------------------------------------------------------------------
export interface BlueprintItem {
  name: string;
  role: string;
  why: string;
}

export const BORING_BLUEPRINT: BlueprintItem[] = [
  {
    name: "Google Sheets",
    role: "Database, CMS, CRM, queue",
    why: "It's a database that a non-technical collaborator can also edit. No migrations, no ORM, no deployment. If a project outgrows it, that's a great problem to have.",
  },
  {
    name: "Google Docs",
    role: "Long-form drafts & SOPs",
    why: "Drafting in a Doc and pasting into the LLM beats fighting a fancy editor. Comments and version history are free. It's where half my prompts are born.",
  },
  {
    name: "Gmail + Filters",
    role: "Inbox as a trigger",
    why: "Filtered labels are a free event queue. A labeled email becomes the trigger for a manual or scripted next step without wiring up webhooks.",
  },
  {
    name: "One LLM UI (Claude)",
    role: "Vibe coding & reasoning",
    why: "One tab. One context window I actually understand. Switching between five providers to save $0.02 is the most expensive cheap thing I do.",
  },
  {
    name: "Next.js on a $5 host",
    role: "Where things actually live",
    why: "If something is worth shipping, it gets a URL. Static when possible, a tiny server when not. No Kubernetes, ever, for a side project.",
  },
];

// ---------------------------------------------------------------------------
// THE CUT LIST — tools I don't use (and why)
// ---------------------------------------------------------------------------
export interface CutItem {
  category: string;
  verdict: string;
  reason: string;
}

export const CUT_LIST: CutItem[] = [
  {
    category: "Yet another \"AI note-taking\" app",
    verdict: "CUT",
    reason: "I already have Google Docs and a brain. The fourth place to store a thought is where thoughts go to die.",
  },
  {
    category: "No-code website builders with AI bolted on",
    verdict: "CUT",
    reason: "The AI features are demos of AI features. By the time you've wrestled the builder into doing what you want, you could have shipped a Next.js page.",
  },
  {
    category: "Browser automation \"agents\" that promise the world",
    verdict: "CUT (for now)",
    reason: "They work on the demo site and faceplant on the third real page. I'll revisit when one survives a real checkout flow unattended.",
  },
  {
    category: "A second LLM provider \"for redundancy\"",
    verdict: "CUT",
    reason: "Redundancy I never test is theater. One model, used daily, beats three I only touch during outages.",
  },
  {
    category: "Dedicated project management SaaS",
    verdict: "CUT",
    reason: "A Google Sheet titled 'stuff to ship' has outperformed every PM tool I've ever onboarded onto. Onboarding is a tax; Sheets charge nothing.",
  },
  {
    category: "Analytics dashboards with 40 widgets",
    verdict: "CUT",
    reason: "I need one number: did it ship and did anyone care. A single Sheet cell holds that. The other 39 widgets are procrastination in pie-chart form.",
  },
];

// ---------------------------------------------------------------------------
// WORKFLOW BLUEPRINTS — under-30-minute recipes
// ---------------------------------------------------------------------------
export interface WorkflowRecipe {
  title: string;
  minutes: number;
  goal: string;
  steps: string[];
  payoff: string;
}

export const WORKFLOWS: WorkflowRecipe[] = [
  {
    title: "Sheets → AI → Draft newsletter",
    minutes: 22,
    goal: "Turn a week of scattered notes into a sendable newsletter draft without a CMS.",
    steps: [
      "Keep a single Google Sheet called 'this week' with one column: raw one-liners as they happen.",
      "At week's end, copy the column into a Google Doc and add any context a stranger would need.",
      "Paste the Doc into Claude with the prompt: \"Group these into 3 sections, keep my voice, cut anything that sounds like marketing.\"",
      "Edit the output by hand for 5 minutes. Paste into your email tool. Hit send.",
    ],
    payoff: "A sent newsletter beats a perfect draft in Notion. No backend, no scheduler, no Zapier bill.",
  },
  {
    title: "Gmail label → Sheets row → AI summary",
    minutes: 18,
    goal: "Capture support-ish emails and summarize them weekly without a helpdesk.",
    steps: [
      "Create a Gmail filter that labels anything customer-ish as 'inbox-log'.",
      "Once a week, copy the subject + snippet of those emails into two Sheet columns.",
      "Ask the LLM: \"Cluster these, name the top 3 themes, suggest one tiny doc I should write.\"",
      "Write that one doc in Google Docs. Link it from the Sheet. Archive the emails.",
    ],
    payoff: "You now have a feedback loop made of tools that already exist. Zero new accounts.",
  },
  {
    title: "Idea → scored Sheet → one shipped prototype",
    minutes: 27,
    goal: "Stop hoarding ideas. Score them, pick one, and force a tiny ship the same day.",
    steps: [
      "Dump every idea into a Sheet column called 'idea'. No editing.",
      "Add three columns: itch (1-5), can-do-today (1-5), boring-tools-only (Y/N).",
      "Sort by itch × can-do, filtered to boring-tools-only = Y.",
      "Take the top row. Build the smallest possible version in under an hour. Add the URL to a fourth column: 'shipped'.",
    ],
    payoff: "The Sheet becomes a graveyard of ideas you actually evaluated, not a graveyard of ideas you forgot. The fourth column is the only one that matters.",
  },
];

// ---------------------------------------------------------------------------
// ABOUT — In the Arena
// ---------------------------------------------------------------------------
export const ABOUT = {
  eyebrow: "About / In the Arena",
  title: "I haven't had the big win. That's the point.",
  intro: [
    "There is no seven-figure exit in my bio. No \"ex-[BigTech]\" line. No course I'm upselling you by the fifth paragraph.",
    "I'm a tinkerer. I build small things with AI, most of them don't work, a few of them do, and I write down the difference while it's still fresh. This site is the field notes.",
    "If you want a guru, this is the wrong URL. Gurus sell the destination. I only have the commute — the part where you're stuck in traffic, the demo broke, and you're trying to remember why you thought this was a good idea at 11pm.",
  ],
  whyThisWorks: [
    {
      title: "A guru's course is a highlight reel",
      body: "It's built after the fact, with the dead ends sanded off. You can't copy a highlight reel. You can copy a process — and a process is only honest when it includes the parts that didn't work.",
    },
    {
      title: "I'm using these tools today, not in 2021",
      body: "Most \"expert\" material is frozen at the moment the expert peaked. The tools move weekly. I move with them because I'm in the same trench you are, this week, with the same broken docs.",
    },
    {
      title: "The figuring-out is the content",
      body: "There's no product at the end of this funnel. The figuring-out process IS the product. That means I have no incentive to pretend I've already figured it out.",
    },
  ],
  rulesTitle: "My Rules of Engagement",
  rules: [
    {
      rule: "I won't recommend a tool unless I shipped something with it.",
      detail: "Vibes and demo videos don't count. A thing has to survive a real build to earn a mention here.",
    },
    {
      rule: "I will always show the error messages.",
      detail: "If a log entry doesn't include what broke, it's marketing, not a log. Marketing has its place; this isn't it.",
    },
    {
      rule: "I prioritize speed over optimization.",
      detail: "The ugly thing that exists today teaches me more than the elegant thing I'll finish in February.",
    },
    {
      rule: "I default to the boring tool.",
      detail: "Google Sheets before Postgres. A Doc before a CMS. If the boring tool fails, that's information worth paying for.",
    },
    {
      rule: "I publish the pivots, not just the wins.",
      detail: "A 'STATUS: PIVOTED' entry is a finished thought. A 'STATUS: SHIPPED' entry is a starting point. Both go up.",
    },
    {
      rule: "I don't write hype.",
      detail: "No 'revolutionary', no 'game-changing', no 'mind-blowing'. If a word would feel gross in a conversation with a friend, it doesn't go on the page.",
    },
  ],
  closing:
    "If any of that sounds like a less lonely way to build, drop your email in the box. One raw shipping log a week. No funnels, no upsells, no \"DM me 'SHIP' for the template.\" Just the commute.",
};

// ---------------------------------------------------------------------------
// CTA / NEWSLETTER
// ---------------------------------------------------------------------------
export const CTA = {
  title: "Get the raw shipping logs",
  body: "One email a week: what I tried, what broke, the boring workaround that actually shipped. No spam, no hype lists, no 'reply with the word MAGIC'. Unsubscribe by ignoring me, like a normal person.",
  placeholder: "you@somewhere.real",
  button: "Send me the logs",
  reassurance: "No spam. No 7-day course drip. One email, weekly, written by a human who is tired.",
};

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
export const FOOTER = {
  tagline:
    "The Honest Tinkerer — practical AI building, written from the trenches.",
  note: "Built with boring tools. Powered by errors I'm willing to publish.",
  built: "Next.js, Tailwind, a single LLM, and a Google Sheet.",
};

// ---------------------------------------------------------------------------
// SEED SHIPPING LOGS
// Ordered oldest -> newest by createdAt. toolStack is comma-separated.
// ---------------------------------------------------------------------------
export const SEED_LOGS: ShippingLog[] = [
  {
    id: "seed-1",
    title: "Google Sheets as a poor-coder' CMS for a tiny landing page",
    goal: "Ship a landing page whose copy I could edit from my phone without redeploying.",
    techStack: "Google Sheets, Next.js, Vercel",
    wall: "Tried to wire a 'real' headless CMS first. Spent a full evening on content modelling and got the page looking exactly like the CMS's dashboard instead of my landing page.",
    pivot: "Replaced the CMS with one public Google Sheet and a 12-line fetch. The page reads its copy from a sheet called 'copy'. I edit the sheet. The page changes. That's it.",
    metric: "Wasted ~5 hours on the CMS. Shipped the Sheets version in 40 minutes. Value: I've edited copy from a bus stop since.",
    status: "SHIPPED",
    toolStack: "Google Sheets,Next.js,Vibe Coding",
    timeSpent: "1 day",
    createdAt: "2025-09-08T10:00:00.000Z",
  },
  {
    id: "seed-2",
    title: "AI-generated landing-page 'factory' that ate a weekend",
    goal: "Point a model at a spreadsheet of business names and get 30 finished landing pages.",
    techStack: "Claude, an AI site builder, wishful thinking",
    wall: "The generated pages were 80% correct and 100% uncanny. Every one needed the same five manual fixes, which defeated the entire 'factory' premise.",
    pivot: "Killed the factory. Built one good template by hand, then used the model only to fill the copy per business. Slower per page, but each page actually shipped.",
    metric: "1 weekend lost, 0 usable pages from the factory. The fallback shipped 4 real pages the next day.",
    status: "FAILED",
    toolStack: "Claude,AI Site Builder",
    timeSpent: "1 week+",
    createdAt: "2025-09-15T14:30:00.000Z",
  },
  {
    id: "seed-3",
    title: "A newsletter from a single Claude prompt",
    goal: "Write a weekly newsletter without a 'content system'.",
    techStack: "Claude, Google Docs, email tool",
    wall: "First few attempts came back sounding like a LinkedIn influencer who'd been left in the sun too long. The model defaulted to hype words I'd never use.",
    pivot: "Added a 'voice' doc: three of my real paragraphs plus the line 'no hype words, ever'. Pasted it before the prompt. Output stopped sounding like a TED talk.",
    metric: "~3 hours of bad drafts before the voice doc. Now ~25 minutes per issue, including the hand-edit.",
    status: "SHIPPED",
    toolStack: "Claude,Google Docs",
    timeSpent: "1-4 hours",
    createdAt: "2025-09-22T09:15:00.000Z",
  },
  {
    id: "seed-4",
    title: "Vibe-coded a Chrome extension to retitle my tabs",
    goal: "Stop my browser from becoming a wall of 'Untitled' and vague favicons.",
    techStack: "Claude, vanilla JS, Chrome extensions API",
    wall: "The model kept inventing a permissions flag that doesn't exist (`activeHistory` instead of `history`). It would confidently write code around a hallucinated API for three turns straight.",
    pivot: "Stopped trusting the model on the API surface. Pasted the actual extensions API doc page into context. The extension then shipped in one more pass.",
    metric: "2 hours of arguing with a hallucination. 20 minutes once I fed it the real docs. The lesson: the model is a writer, not a reference manual.",
    status: "SHIPPED",
    toolStack: "Claude,Vibe Coding",
    timeSpent: "1-4 hours",
    createdAt: "2025-09-29T20:00:00.000Z",
  },
  {
    id: "seed-5",
    title: "Notion database as a CRM (and why I left)",
    goal: "Track people I'd talked to and what we'd agreed to, in something nicer than a sheet.",
    techStack: "Notion, a lot of properties, hope",
    wall: "By week two the database had 14 properties and three views I never opened. Adding a contact took longer than the conversation it recorded.",
    pivot: "Exported to a flat Google Sheet with four columns: who, when, what we said, next step. Used it daily within a day.",
    metric: "~6 hours building the Notion setup. ~10 minutes rebuilding as a sheet. The sheet has outlasted the database by months.",
    status: "PIVOTED",
    toolStack: "Google Sheets,Notion",
    timeSpent: "1 day",
    createdAt: "2025-10-06T11:45:00.000Z",
  },
  {
    id: "seed-6",
    title: "Custom GPT as a 24/7 support agent",
    goal: "Let a custom GPT answer repeat questions about a small product so I could stop.",
    techStack: "Custom GPT, uploaded docs",
    wall: "It answered confidently and wrong on anything that wasn't verbatim in the docs. Worse, it was polite about it, which made the wrongness feel trustworthy to the person asking.",
    pivot: "Didn't ship it as a front-line agent. Instead I used it internally: I answer the email myself, then ask the GPT to suggest which doc would have prevented it. I write that doc. The inbox shrinks.",
    metric: "0 hours saved as a front-line bot (would have cost goodwill). ~2 hours/week saved via the doc-suggestion loop.",
    status: "FAILED",
    toolStack: "Claude,Google Docs",
    timeSpent: "1-4 hours",
    createdAt: "2025-10-13T16:20:00.000Z",
  },
  {
    id: "seed-7",
    title: "A freelancer expense tracker that lives in one Sheet",
    goal: "Know what I actually earned without opening accounting software I'd avoid.",
    techStack: "Google Sheets, a single formula, discipline",
    wall: "Tried a 'real' bookkeeping app. Opened it twice. The friction of logging an expense was higher than the expense itself, so I stopped logging, so the app was useless.",
    pivot: "One Sheet. Columns: date, amount, what, category. A running SUM at the top. I log on my phone in 8 seconds the moment I spend. The friction is lower than the forgetting.",
    metric: "$0 in software. ~8 seconds per entry. I now actually know my numbers, which two paid apps failed to achieve.",
    status: "SHIPPED",
    toolStack: "Google Sheets",
    timeSpent: "< 1 hour",
    createdAt: "2025-10-20T08:30:00.000Z",
  },
  {
    id: "seed-8",
    title: "Auto-summarize long YouTube videos I'll never finish",
    goal: "Extract the one useful thing from a 90-minute tutorial without watching 90 minutes.",
    techStack: "Transcript export, Claude, a script",
    wall: "Auto-generated transcripts are a swamp of [Music] and um. Feeding the raw transcript produced a summary that was also a swamp.",
    pivot: "Added a cleaning step: strip bracketed noise and collapses repeated words before summarizing. Summary went from useless to 'actually the three things I needed.'",
    metric: "~1 hour to write the cleaner. Saves ~85 minutes per video I'd otherwise half-watch and retain nothing from.",
    status: "IN_PROGRESS",
    toolStack: "Claude,Google Sheets,Vibe Coding",
    timeSpent: "1-4 hours",
    createdAt: "2025-10-27T19:10:00.000Z",
  },
  {
    id: "seed-9",
    title: "Image-to-blog-post pipeline (over-engineered, then cut in half)",
    goal: "Drop a photo in, get a draft blog post out, with a real voice.",
    techStack: "VLM, Claude, a queue I didn't need",
    wall: "Built a 4-step pipeline with a queue, retries, and a status dashboard. The dashboard took longer than the writing. The queue was for volume I didn't have.",
    pivot: "Deleted the queue and the dashboard. Now: one prompt, one image, one draft. If I ever have 'volume', I'll add the queue then. I don't.",
    metric: "~4 hours of pipeline I threw away. The single-prompt version took 15 minutes and gets used.",
    status: "PIVOTED",
    toolStack: "Claude,VLM,Vibe Coding",
    timeSpent: "1 day",
    createdAt: "2025-11-03T13:00:00.000Z",
  },
  {
    id: "seed-10",
    title: "Voice note → today's task list",
    goal: "Mumble my morning plan into my phone and get a sorted to-do back.",
    techStack: "Voice memos, Claude, Google Tasks",
    wall: "The model wanted to turn 4 tasks into 12 'subtasks' with priorities and dependencies. A morning brain-dump became a project plan I'd ignore.",
    pivot: "Prompt now ends with: 'Return only what I said, as a flat list, in the order I'll actually do them. No subtasks. No priorities. Stop being helpful.' It stopped being helpful. It started being useful.",
    metric: "~2 hours fighting the model's eagerness. ~30 seconds per morning now. The flat list gets done; the project plan never did.",
    status: "SHIPPED",
    toolStack: "Claude,ASR",
    timeSpent: "1-4 hours",
    createdAt: "2025-11-10T07:40:00.000Z",
  },
  {
    id: "bluevibe-1",
    title: "The Reality of \"Vibe Coding\" an App in 2026",
    goal: "Watched YouTube devs build the 'next big social media app' and thought: why not me? I'll just vibe-code one with AI and docs.",
    techStack: "Claude, AI tooling, documentation, ambition",
    wall: "I actually got a working prototype — and then the over-thinking kicked in. I rushed the progression and built a bloated, over-engineered system instead of shipping the small thing. Proud of it and disappointed in it at the same time. Then the hard truth landed: you can't hand the model a 'perfect' prompt and expect flawless execution. There is always an error. There is always drift. Burned out, I walked away from the hell of my own creation. Tried to revive it later this year. I failed.",
    pivot: "No neat fix this time — the takeaway is the lesson. AI alone cannot build a successful project. Without fundamental knowledge of architecture and infrastructure, you're just building a house of cards. The prototype is still standing (barely); the revival isn't. Lesson learned. Onto the next.",
    metric: "1 working prototype that became a house of cards. 1 failed revival. The expensive lesson: vibe coding without fundamentals is sand, not foundation. Worth every hour I won't get back.",
    status: "FAILED",
    toolStack: "Claude,Vibe Coding",
    timeSpent: "1 week+",
    createdAt: "2025-11-17T18:20:00.000Z",
    demo: "bluevibe",
  },
];

// ---------------------------------------------------------------------------
// EMBEDDED DEMO METADATA
// ---------------------------------------------------------------------------
// Each demo kind maps (in src/lib/demo-registry.ts) to an interactive React
// component rendered inside the log detail. The metadata here is data-driven
// so the external link + caption travel with the content, not the component.

export interface DemoMeta {
  kind: string;
  externalUrl: string;
  title: string;
  caption: string;
}

export const BLUEVIBE_DEMO: DemoMeta = {
  kind: "bluevibe",
  externalUrl: "https://bluevibe-dun.vercel.app",
  title: "BlueVibe — the prototype",
  caption:
    "What actually shipped before the over-engineering set in. A working social feed skeleton — vibe-coded, barely standing. Tap around; the likes fire twice on purpose (that one's a real bug from the build).",
};

// Seed posts for the embedded BlueVibe demo. Self-contained, no backend.
export interface BlueVibePost {
  id: number;
  author: string;
  handle: string;
  initials: string;
  hue: number; // avatar hue
  time: string;
  text: string;
  likes: number;
  drift?: boolean; // a post that "drifted" from the original prompt
}

export const BLUEVIBE_SEED_POSTS: BlueVibePost[] = [
  {
    id: 1,
    author: "the tinkerer",
    handle: "@tinkerer",
    initials: "TT",
    hue: 28,
    time: "now",
    text: "just vibe-coded a whole social feed in an afternoon. what could go wrong",
    likes: 4,
  },
  {
    id: 2,
    author: "drift detector",
    handle: "@drift",
    initials: "DD",
    hue: 340,
    time: "12m",
    text: "the model added a 'trending' tab I never asked for. classic drift. shipped it anyway because deleting it felt like work.",
    likes: 9,
    drift: true,
  },
  {
    id: 3,
    author: "house of cards",
    handle: "@cards",
    initials: "HC",
    hue: 200,
    time: "1h",
    text: "refactor later they said. refactor never I said. the like button fires twice and I have decided this is a feature.",
    likes: 17,
    drift: true,
  },
  {
    id: 4,
    author: "the tinkerer",
    handle: "@tinkerer",
    initials: "TT",
    hue: 28,
    time: "3h",
    text: "reminder to self: a working prototype is not a product. a working prototype is a very expensive question.",
    likes: 23,
  },
];

// ---------------------------------------------------------------------------
// NEWSLETTER — "The Friday Log Dump"
// ---------------------------------------------------------------------------
// The working newsletter: Option B architecture (Next.js API route collects
// emails into SQLite; the weekly issue is server-rendered from the latest
// shipping log). The content format below is the exact template the latest
// endpoint renders. No Substack, no Loops bill, no 7-day drip.

export const NEWSLETTER = {
  eyebrow: "The Newsletter",
  title: "The Friday Log Dump",
  intro:
    "One email a week. Same aesthetic as the site. No 2,000-word deep dives — people are subscribing to see the trenches, not a TED talk. The issue is generated from the most recent shipping log entry, so the newsletter writes itself the moment I publish a build. That's the whole point of the boring stack.",
  stackNote:
    "Built on Option B: a Next.js API route collects emails into the database, the weekly issue is rendered server-side from the latest shipping log, and hitting Send delivers it to every subscriber via Gmail SMTP (nodemailer, one BCC message). No email-automation SaaS, no Zapier bill, no three-week setup. The outbox row is the receipt.",
  formatTitle: "The email format",
  formatBody:
    "Every issue follows the same high-scannability template. Identical to the site's aesthetic on purpose — if the email looks nothing like the site, something has gone wrong.",
  goldenRule: {
    title: "The golden rule",
    body: "Write the email while you are still annoyed. The best issue for this specific brand gets written ten minutes after you finally give up on a bug for the night. Don't wait until Monday when you've calmed down and forgotten the frustration. Capitalize on the raw reality of the build — that's the only edge a non-guru has.",
  },
  growth: {
    title: "Growth without hype",
    body: "The \"reply with MAGIC\" crowd hides their failures. Lean on the exact thing they try to hide.",
    tactics: [
      {
        title: "Build in public with anti-hype hooks",
        body: "Instead of \"How I built an AI app in 2 hours,\" post: \"I spent 6 hours trying to make an AI build a social media app, and it created a bloated piece of trash. Here's the architectural wall I hit.\" End with a link to the newsletter. Tech Twitter craves this honesty.",
      },
      {
        title: "The 'graveyard' launch",
        body: "Launch the newsletter by sharing your archive of dead projects. Post a list of 3 things you failed to build this year and what they cost you in time. Tell people: if you want to see the next thing I break in real-time, subscribe.",
      },
      {
        title: "Hacker News & tech subreddits",
        body: "When you write a solid post-mortem about an AI failure (like why prompting alone can't handle system architecture), post it to HN. Developers love analyzing why AI systems fail — a single front-page hit can net 1,000+ subscribers overnight.",
      },
    ],
  },
  repoNote:
    "No public repo for most of these. They were dead ends — that's the point of the log. When a build has a live demo, the link goes here instead.",
};

// Seed broadcasts — past issues already "sent", so the archive isn't empty.
export const SEED_BROADCASTS: {
  issue: number;
  subject: string;
  logId: string;
  logTitle: string;
  recipientCount: number;
  sentAt: string;
}[] = [
  {
    issue: 1,
    subject: "Log #01: The week a headless CMS ate my landing page",
    logId: "seed-1",
    logTitle: "Google Sheets as a poor-coder' CMS for a tiny landing page",
    recipientCount: 12,
    sentAt: "2025-09-12T19:00:00.000Z",
  },
  {
    issue: 2,
    subject: "Log #02: The landing-page factory that produced zero pages",
    logId: "seed-2",
    logTitle: "AI-generated landing-page 'factory' that ate a weekend",
    recipientCount: 27,
    sentAt: "2025-09-19T19:00:00.000Z",
  },
];
