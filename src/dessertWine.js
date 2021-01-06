const pageScraper = require("./pageScraper");

async function dessertWine(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlDessertWine =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=fortified";

    const allDessertWines = await pageScraper.scraper(
      browser,
      baseUrlDessertWine,
    );

    return allDessertWines;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => dessertWine(browserInstance);
