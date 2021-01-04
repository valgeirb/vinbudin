const pageScraper = require("./pageScraper");
const Listr = require("listr");

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

    const tasks = new Listr([
      {
        title: "Scraping beers",
        task: () => {
          return new Listr([
            {
              title: "All beers",
              task: async () => {
                allBeers = await pageScraper.scraper(
                  browser,
                  "https://www.vinbudin.is/english/home/products/vorur.aspx/?category=beer&page=23",
                );
              },
            },
            {
              title: "Christmas beers",
              task: async () => {
                christmasBeers = await pageScraper
                  .scraper(browser, `${baseUrlBeers}&season=J%C3%93L`)
                  .then((beers) =>
                    beers.map((beer) => ({
                      ...beer,
                      season: "CHRISTMAS",
                    })),
                  );
              },
            },
            {
              title: "October beers",
              task: async () => {
                octoberBeers = await pageScraper
                  .scraper(browser, `${baseUrlBeers}&season=OKT%C3%93BER`)
                  .then((beers) =>
                    beers.map((beer) => ({
                      ...beer,
                      season: "OCTOBER",
                    })),
                  );
              },
            },
            {
              title: "Easter beers",
              task: async () => {
                easterBeers = await pageScraper
                  .scraper(browser, `${baseUrlBeers}&season=P%C3%81SKAR`)
                  .then((beers) =>
                    beers.map((beer) => ({
                      ...beer,
                      season: "EASTER",
                    })),
                  );
              },
            },
            {
              title: "Thorri beers",
              task: async () => {
                thorriBeers = await pageScraper
                  .scraper(browser, `${baseUrlBeers}&season=%C3%9EORRI`)
                  .then((beers) =>
                    beers.map((beer) => ({
                      ...beer,
                      season: "THORRI",
                    })),
                  );
              },
            },
          ]);
        },
      },
    ]);

    await tasks.run().catch((err) => {
      console.error(err);
    });

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

    await browser.close();

    return beers;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => beers(browserInstance);
