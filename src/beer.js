const pageScraper = require("./pageScraper");

async function beers(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    const baseUrlBeers =
      "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=beer";

    let allBeers = [];
    let christmasBeers = [];
    let octoberBeers = [];
    let easterBeers = [];
    let thorriBeers = [];

    allBeers = await pageScraper.scraper(browser, baseUrlBeers);

    christmasBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=J%C3%93L`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "CHRISTMAS",
        })),
      );

    octoberBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=OKT%C3%93BER`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "OCTOBER",
        })),
      );

    easterBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=P%C3%81SKAR`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "EASTER",
        })),
      );

    thorriBeers = await pageScraper
      .scraper(browser, `${baseUrlBeers}&season=%C3%9EORRI`)
      .then((beers) =>
        beers.map((beer) => ({
          ...beer,
          season: "THORRI",
        })),
      );

    const seasonalBeers = [
      ...christmasBeers,
      ...octoberBeers,
      ...easterBeers,
      ...thorriBeers,
    ];

    const beers = allBeers.map((beer) => {
      const beerDuplicate = seasonalBeers.find(
        (seasonalBeer) => seasonalBeer.productId === beer.productId,
      );

      return beerDuplicate
        ? {
            ...beer,
            season: beerDuplicate.season,
          }
        : beer;
    });

    return beers;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => beers(browserInstance);
