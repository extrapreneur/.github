import puppeteer from "puppeteer";
import Parser from "rss-parser";
import { toVFile, readSync } from "to-vfile";
import { remark } from "remark";
import { zone } from "mdast-zone";
import { promisify } from "util";
import { writeFile } from "fs";
import { join } from "path";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readmePath = join(__dirname, "profile/README.md");

async function getAboutUsString() {
  console.log("Starting getAboutUsString...");
  const browser = await puppeteer.launch({ headless: "new" });
  console.log("Browser launched...");
  const page = await browser.newPage();
  console.log("New page created...");
  const navigationTimeout = 30000; // Increase the timeout to 30 seconds
  await page.setDefaultNavigationTimeout(navigationTimeout); // Set the navigation timeout
  await page.setViewport({ width: 1000, height: 500 });
  console.log("Navigating to the page...");
  await page.goto("https://www.extrapreneur.se/en/about-us");
  console.log("Page navigated...");
  await page.waitForSelector("#block-a69218aa3038e836d047 > div > div > p:nth-child(2)", { timeout: 60000 });
  const result = await page.evaluate(
    () =>
      document.querySelector(
        "#block-a69218aa3038e836d047 > div > div > p:nth-child(2)"
      ).innerHTML
  );
  console.log("Content extracted...");
  await browser.close();
  console.log("Browser closed...");
  console.log("getAboutUsString completed.");
  return result;
}

async function refreshAboutUsParagraph() {
  const aboutUsString = await getAboutUsString();
  const string = aboutUsString.split("\\").join("").trim();

  return (tree) => {
    zone(tree, "about", (start, nodes, end) => [
      start,
      {
        type: "paragraph",
        children: [{ type: "html", value: string }],
      },
      end,
    ]);
  };
}

(async () => {
  const file = await remark()
    .use(refreshAboutUsParagraph)
    .process(toVFile.readSync(readmePath));
  await promisify(writeFile)(readmePath, String(file));
})();

async function refreshBlogPosts(feedItems) {
  return () => (tree) => {
    zone(tree, "blog", (start, nodes, end) => {
      return [
        start,
        {
          type: "list",
          ordered: false,
          children: feedItems.map(({ title, link }) => ({
            type: "listItem",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "link",
                    url: link,
                    children: [{ type: "text", value: title }],
                  },
                  { type: "html", value: "<br/>" },
                ],
              },
            ],
          })),
        },
        end,
      ];
    });
  };
}

(async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(
    "https://www.extrapreneur.se/blog?format=rss"
  );
  const file = await remark()
    .use(refreshBlogPosts(feed.items.slice(0, 5)))
    .process(toVFile.readSync(readmePath));
  await promisify(writeFile)(readmePath, String(file));
})();
