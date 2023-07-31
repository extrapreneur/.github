//adding libraries

//const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";

//const RssParser = require("rss-parser");
import Parser from "rss-parser";
let parser = new Parser();

//const vfile = require("to-vfile");
import { toVFile, readSync } from "to-vfile";

//const remark = require("remark");
import { remark } from "remark";

//const zone = require("mdast-zone");
import { zone } from "mdast-zone";

//const { promisify } = require("util");
import { promisify } from "util";

//const { writeFile } = require("fs");
import { writeFile } from "fs";

//const { join } = require("path");
import { join } from "path";

import path from "path";
import { fileURLToPath } from "url";
import { constants } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = join(__dirname, "profile/README.md");

// Rip about us first paragraph and blog links
const getAboutUsString = await puppeteer.launch({headless: 'new'}).then(async (browser) => {
  //browser new page
  const p = await browser.newPage();
  //set viewpoint of browser page
  await p.setViewport({ width: 1000, height: 500 });
  await p.goto("https://www.extrapreneur.se/blog");

  // const result = await p.evaluate(
  //   () =>
  //     document.querySelector("#block-a69218aa3038e836d047 > div > p").innerHTML
  // );

  const result = await p.evaluate(
    () =>
      document.querySelector(
        "#sections > section > div.content-wrapper > div > div > article:nth-child(1) > div.blog-basic-grid--text > h1 > a"
      ).innerHTML
  );
  /*   await p.goto("https://www.extrapreneur.se/blog");

  const blogPostLinks = await p.evaluate(() =>
    Array.from(document.getElementsByTagName("h1"), (e) => e.innerHTML)
  ); */

  await browser.close();

  return result;
});

const file = await remark()
  .use(refreshAboutUsParagraph)
  .process(toVFile.readSync(readmePath));
await promisify(writeFile)(readmePath, String(file));

function refreshAboutUsParagraph() {
  let string = getAboutUsString.split("\\").join("").trim();

  // let str = theText.split("A").join("");
  console.log(string)
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
  const feed = await parser.parseURL(
    "https://www.extrapreneur.se/blog?format=rss"
  );
  const file = await remark()
    .use(refreshBlogPosts(feed.items.slice(0, 5)))
    .process(toVFile.readSync(readmePath));
  await promisify(writeFile)(readmePath, String(file));
})();

function refreshBlogPosts(feedItems) {


  
  //console.log(feedItems);
  return () => (tree) => {
    zone(tree, "blog", (start, nodes, end) => {
      return [
        start,
        {
          type: "list",
          ordered: false,
          children: feedItems.map(
            ({ title, link, contentSnippet, pubDate }) => {
              //console.log(title,link)
              return {
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
                      //{
                      //  type: "emphasis",
                      //  children: [{ type: "text", value: contentSnippet }],
                      //},
                    ],
                  },
                ],
              };
            }
          ),
        },
        end,
      ];
    });
  };
}
