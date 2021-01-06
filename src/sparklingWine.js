const pageScraper = require("./pageScraper");

async function sparklingWine(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlSparklingWine =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=bubbly";

    const allSparklingWines = await pageScraper.scraper(
      browser,
      baseUrlSparklingWine,
    );

    return allSparklingWines;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => sparklingWine(browserInstance);
