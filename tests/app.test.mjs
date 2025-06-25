import puppeteer from "puppeteer";

const indexUrl = "https://www.extrapreneur.se/en/home";
const postsUrl = "https://www.extrapreneur.se/blog";

describe("Scraping Tests", () => {
  jest.setTimeout(120000); // <-- Move here

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("Verify index URL loads correctly", async () => {
    await page.goto(indexUrl);
    await page.waitForSelector("h2", { timeout: 120000 });
    const content = await page.evaluate(
      () => document.querySelector("p").textContent
    );
    expect(content).toBeTruthy();
  });

  test("Verify posts URL loads correctly", async () => {
    await page.goto(postsUrl);
    await page.waitForSelector("h1", { timeout: 120000 });
    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h1"))
        .slice(0, 5)
        .map((h1) => h1.textContent.trim());
    });
    expect(titles.length).toBeGreaterThan(0);
  });

  test("Verify scraped data contains valid links", async () => {
    await page.goto(postsUrl);
    await page.waitForSelector("h1", { timeout: 120000 });
    const scrapedData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h1"))
        .slice(0, 5)
        .map((h1) => {
          const anchor =
            h1.closest("a") ||
            h1.querySelector("a") ||
            h1.parentElement.querySelector("a");
          return {
            title: h1.textContent.trim(),
            link: anchor ? anchor.href.trim() : "#",
          };
        });
    });
    scrapedData.forEach((item) => {
      expect(item.title).toBeTruthy();
      expect(item.link).toMatch(/^https?:\/\/.+/);
    });
  });
});
