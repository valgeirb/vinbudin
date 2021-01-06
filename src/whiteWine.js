const pageScraper = require("./pageScraper");

async function whiteWine(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlWhiteWine =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=white";

    const allWhiteWines = await pageScraper.scraper(browser, baseUrlWhiteWine);

    return allWhiteWines;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => whiteWine(browserInstance);
