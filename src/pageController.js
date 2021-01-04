// const fs = require("fs");
const pageScraper = require("./pageScraper");
async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    /* const baseUrlBeers =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=beer";

    const beers = await pageScraper.scraper(browser, baseUrlBeers);

    const christmasBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=J%C3%93L`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "CHRISTMAS",
        })),
      );

    const octoberBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=OKT%C3%93BER`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "OCTOBER",
        })),
      );

    const easterBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=P%C3%81SKAR`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "EASTER",
        })),
      );

    const thorriBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=%C3%9EORRI`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "THORRI",
        })),
      ); */

    await browser.close();

    /* let scrapedData = {
      beers: christmasBeers,
    };

    fs.writeFile("data.json", JSON.stringify(scrapedData), "utf8", (err) => {
      if (err) {
        return console.log(err);
      }

      console.log("Scrape complete, see './data.json'");
    }); */
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
