const pageScraper = require("./pageScraper");

async function roseWine(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlRoseWine =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=rose";

    const allRoseWines = await pageScraper.scraper(browser, baseUrlRoseWine);

    return allRoseWines;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => roseWine(browserInstance);
