const pageScraper = require("./pageScraper");

async function redWine(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlRedWine =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=red";

    const allRedWines = await pageScraper.scraper(browser, baseUrlRedWine);

    return allRedWines;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => redWine(browserInstance);
