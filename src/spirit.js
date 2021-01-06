const pageScraper = require("./pageScraper");

async function spirit(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlSpirit =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=strong";

    const allSpirits = await pageScraper.scraper(browser, baseUrlSpirit);

    return allSpirits;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => spirit(browserInstance);
