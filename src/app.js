import puppeteer from "puppeteer";
import fs from "fs";
import TurndownService from "turndown";
import { Octokit } from "@octokit/rest";

const readmeFilePath = "profile/README.md";
const tempReadmeFilePath = "README.md";

const indexUrl = "https://www.extrapreneur.se/en/home";
const postsUrl = "https://www.extrapreneur.se/blog";

async function scrape() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await updateSection(
      page,
      indexUrl,
      "h2",
      "p",
      "START_ABOUT_SECTION",
      "END_ABOUT_SECTION"
    );
    await updatePostsSection(
      page,
      postsUrl,
      "h1",
      "START_POSTS_SECTION",
      "END_POSTS_SECTION"
    );
    await updateContributorsSection();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

async function updateSection(
  page,
  url,
  waitForSelector,
  contentSelector,
  startTag,
  endTag
) {
  try {
    await page.goto(url);
    await page.waitForSelector(waitForSelector, { timeout: 60000 });
    const scrapedHTML = await page.evaluate((selector) => {
      return document.querySelector(selector).textContent;
    }, contentSelector);

    const turndownService = new TurndownService();
    const scrapedMarkdown = turndownService.turndown(scrapedHTML);
    const readmeContent = fs.readFileSync(readmeFilePath, "utf8");
    const updatedReadmeContent = readmeContent.replace(
      new RegExp(`<!-- ${startTag} -->.*<!-- ${endTag} -->`, "s"),
      `<!-- ${startTag} -->\n\n${scrapedMarkdown}\n\n<!-- ${endTag} -->`
    );

    fs.writeFileSync(readmeFilePath, updatedReadmeContent);
  } catch (error) {
    console.error("Error updating section:", error);
  }
}

async function updatePostsSection(
  page,
  url,
  waitForSelector,
  startTag,
  endTag
) {
  try {
    await page.goto(url);
    await page.waitForSelector(waitForSelector, { timeout: 60000 });
    const scrapedData = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll("h1"))
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
      return titles;
    });

    const scrapedMarkdown = scrapedData
      .map((item) => `- [${item.title}](${item.link})`)
      .join("\n");
    const readmeContent = fs.readFileSync(readmeFilePath, "utf8");
    const updatedReadmeContent = readmeContent.replace(
      new RegExp(`<!-- ${startTag} -->.*<!-- ${endTag} -->`, "s"),
      `<!-- ${startTag} -->\n\n${scrapedMarkdown}\n\n<!-- ${endTag} -->`
    );

    fs.writeFileSync(readmeFilePath, updatedReadmeContent);
  } catch (error) {
    console.error("Error updating posts section:", error);
  }
}

async function updateContributorsSection() {
  try {
    const octokit = new Octokit({
      auth: process.env.TOKEN,
    });
    const { data: members } = await octokit.orgs.listMembers({
      org: "extrapreneur",
    });

    console.log("Fetched members:", members); // Debugging log

    if (!members || members.length === 0) {
      console.error("No members found in the organization.");
      return;
    }

    const rows = [];
    for (let i = 0; i < members.length; i += 5) {
      const row = members
        .slice(i, i + 5)
        .map(
          (member) =>
            `<td align="center" style="padding: 10px;">
              <a href="https://github.com/${member.login}" style="text-decoration: none; color: inherit;">
                <img src="${member.avatar_url}" width="80" height="80" alt="${member.login}" style="border-radius: 50%;"/>
                <br />
                <sub><b>${member.login}</b></sub>
              </a>
            </td>`
        )
        .join("");
      rows.push(`<tr>${row}</tr>`);
    }

    const contributorsTable = rows.length
      ? `<table style="width: 100%; border-collapse: collapse;">
          ${rows.join("\n")}
        </table>`
      : "<p>No contributors found.</p>";

    console.log("Generated table:", contributorsTable); // Debugging log

    const readmeContent = fs.readFileSync(readmeFilePath, "utf8");
    const updatedReadmeContent = readmeContent.replace(
      new RegExp(
        `<!-- START_CONTRIBUTORS_SECTION -->.*<!-- END_CONTRIBUTORS_SECTION -->`,
        "s"
      ),
      `<!-- START_CONTRIBUTORS_SECTION -->\n\n## Contributors\n\n${contributorsTable}\n\n<!-- END_CONTRIBUTORS_SECTION -->`
    );

    fs.writeFileSync(readmeFilePath, updatedReadmeContent);
  } catch (error) {
    console.error("Error updating contributors section:", error);
  }
}

scrape();
