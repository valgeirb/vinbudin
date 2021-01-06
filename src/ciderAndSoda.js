const pageScraper = require("./pageScraper");

async function ciderAndSoda(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlCiderAndSoda =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=cidersoda";

    const allSiderAndSodas = await pageScraper.scraper(
      browser,
      baseUrlCiderAndSoda,
    );

    return allSiderAndSodas;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => ciderAndSoda(browserInstance);
