import { sleep, withRetry } from "@/utils/promise.utils";
import { chromium, Page } from "playwright";

export type JobInput = {
  sourceId: string;
  title: string;
  company: string;
  location?: string | null;
  type?: string | null;
  tags?: string[];
  salaryText?: string | null;
  daysAgo: number | null;
  description?: string | null;
  applicationUrl: string;
  sourceUrl: string;
};

const BASE = "https://weworkremotely.com";

const CURRENCY = /(?:[$£€]|USD|EUR|GBP|INR|CAD|AUD)/i;
const NUMBLOCK = /\b\d{1,3}(?:[,\s]?\d{3})*(?:\s*[kK])?\b/;
const PERIOD = /(?:\s*(?:per|\/)\s*(?:year|yr|annum|month|mo|hour|hr))?/i;
const SALARY_PATTERN = new RegExp(
  String.raw`(?:` +
    `(?:${NUMBLOCK.source})\\s*-\\s*(?:${NUMBLOCK.source})` +
    `|` +
    `(?:${NUMBLOCK.source})(?:\\s*\\+|\\s*or\\s*more)` +
    `|` +
    `(?:${NUMBLOCK.source})(?:${PERIOD.source})?` +
    `|` +
    `(?:Up\\s*to\\s*)(?:${NUMBLOCK.source})(?:${PERIOD.source})?` +
    `)`,
  "i",
);
const BLACKLIST = /\b(top|rank|hot|trending)\b|%/i;

const parseListingPage = async (page: Page, url: string) => {
  await withRetry(
    () =>
      page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      }),
    `goto ${url}`,
  );

  await sleep(800 + Math.random() * 600);

  const items = await page.$$(
    `div.content div.jobs-container section.jobs article ul li a[href^="/remote-jobs/"]`,
  );
  const jobs: JobInput[] = [];

  for (const a of items) {
    const href = await a.getAttribute("href");
    if (!href) continue;
    const sourceUrl = `${BASE}${href.split("#")[0]}`;

    const rawTitle = await a.$eval(".new-listing__header", (el) =>
      (el as HTMLElement).innerText.trim(),
    );

    const title = rawTitle.split("\n")[0];
    const match = rawTitle.match(/(\d+)d/);

    let daysAgo: number | null = null;
    if (match) {
      daysAgo = parseInt(match[1], 10);
    }

    const company = await a
      .$eval(".new-listing__company-name", (el) =>
        (el as HTMLElement).innerText.trim(),
      )
      .catch(() => "Unknown");

    const location = await a
      .$eval(".new-listing__company-headquarters", (el) =>
        (el as HTMLElement).innerText.trim(),
      )
      .catch(() => null);

    const tags = await a.$$eval(".new-listing__categories__category", (els) =>
      (els as HTMLParagraphElement[]).map((e) => e.innerText.trim()),
    );

    const type = tags.find(
      (v) => v === "Full-Time" || v === "Remote" || v === "Conract",
    );

    const salaryText = tags.find((tag) => {
      const t = tag.trim();

      if (BLACKLIST.test(t)) return false;

      const hasCurrency = CURRENCY.test(t);
      const hasKNumber = /\b\d+\s*[kK]\b/.test(t);

      if (!(hasCurrency || hasKNumber)) return false;

      return SALARY_PATTERN.test(t);
    });

    const sourceId = sourceUrl.replace(/^.*\/remote-jobs\//, "");

    jobs.push({
      sourceId,
      title,
      company,
      location,
      type,
      tags,
      salaryText,
      daysAgo,
      description: null,
      applicationUrl: sourceUrl,
      sourceUrl,
    });
  }

  return jobs;
};

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    userAgent:
      "JobHunterMVPBot/1.0 (+https://example.com; polite crawler for demo)",
  });

  let pageNumber = 1;
  let totalNew = 0;
  const seen = new Set<string>();

  while (true) {
    const url = `${BASE}/remote-full-time-jobs?page=${pageNumber}`;
    console.log(`Listing page ${pageNumber} → ${url}`);
    const jobs = await parseListingPage(page, url);

    console.log(`Page Number -> ${pageNumber}`);
    console.log(`Jobs -> ${jobs.length}`);

    if (!jobs.length) break;

    const newJobs: JobInput[] = [];

    for (const job of jobs) {
      if (seen.has(job.sourceId)) continue;
      seen.add(job.sourceId);
      newJobs.push(job);
    }

    // await upsertJobs(enriched);
    totalNew += jobs.length;

    pageNumber++;
  }

  console.log(`Done. Upserted ~${totalNew} jobs.`);
  await browser.close();
  // await prisma.$disconnect();
}

run()
  .then(() => {
    console.log("Scraped Successfully!✅");
    process.exit(0);
  })
  .catch((error) => {
    throw error;
  });
