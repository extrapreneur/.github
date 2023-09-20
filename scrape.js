
import puppeteer from "puppeteer";
import fs from "fs";
import TurndownService from "turndown";

const readmeFilePath = "scraped.md"; // Replace with your readme file path
const webpageUrl = "https://www.extrapreneur.se/"; // Replace with the URL you want to scrape

async function scrapeWebpage() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    // Navigate to the webpage
    await page.goto(webpageUrl);

    // Wait for an element with a specific selector to appear
    await page.waitForSelector("h2", { timeout: 60000 }); // Increase the timeout as needed

    const scrapedHTML = await page.evaluate(() => {
      return document.querySelector("h2").textContent; // Example: Scrape the text from an h1 element
    });

    // Initialize the Turndown service
    const turndownService = new TurndownService();

    // Convert the scraped HTML to Markdown
    const scrapedMarkdown = turndownService.turndown(scrapedHTML);

    // Read the existing readme content
    const readmeContent = fs.readFileSync(readmeFilePath, "utf8");

    // Replace a specific section in the readme with the scraped Markdown content
    const updatedReadmeContent = readmeContent.replace(
      /<!-- START_SCRAPED_MARKDOWN_SECTION -->.*<!-- END_SCRAPED_MARKDOWN_SECTION -->/s,
      `<!-- START_SCRAPED_MARKDOWN_SECTION -->\n\n${scrapedMarkdown}\n\n<!-- END_SCRAPED_MARKDOWN_SECTION -->`
    );

    // Save the updated content back to the readme file
    fs.writeFileSync(readmeFilePath, updatedReadmeContent);

    console.log("Readme.md updated successfully with scraped Markdown data!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

scrapeWebpage();