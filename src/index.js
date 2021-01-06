const Listr = require("listr");
const browserObject = require("./browser");
const categories = require("./categories");
const browserInstance = browserObject.startBrowser();

function time(ms) {
  return new Date(ms).toISOString().slice(11, -5);
}

module.exports = {
  scrape: async function (
    options = {
      products: {
        beer: true,
        redWine: true,
        whiteWine: true,
        roseWine: true,
        sparklingWine: true,
        dessertWine: true,
        ciderAndSoda: true,
        spirit: true,
      },
    },
  ) {
    const startTime = Date.now();
    let data = {};

    const tasks = new Listr([
      {
        title: "Scraping",
        task: () => {
          return new Listr(
            [
              {
                title: "Beer",
                task: async () =>
                  (data["beer"] = await categories["beer"](browserInstance)),
                skip: () => !options.products["beer"],
              },
              {
                title: "Red wine",
                task: async () =>
                  (data["redWine"] = await categories["redWine"](
                    browserInstance,
                  )),
                skip: () => !options.products["redWine"],
              },
              {
                title: "White wine",
                task: async () =>
                  (data["whiteWine"] = await categories["whiteWine"](
                    browserInstance,
                  )),
                skip: () => !options.products["whiteWine"],
              },
              {
                title: "Rose wine",
                task: async () =>
                  (data["roseWine"] = await categories["roseWine"](
                    browserInstance,
                  )),
                skip: () => !options.products["roseWine"],
              },
              {
                title: "Sparkling wine",
                task: async () =>
                  (data["sparklingWine"] = await categories["sparklingWine"](
                    browserInstance,
                  )),
                skip: () => !options.products["sparklingWine"],
              },
              {
                title: "Dessert wine",
                task: async () =>
                  (data["dessertWine"] = await categories["dessertWine"](
                    browserInstance,
                  )),
                skip: () => !options.products["dessertWine"],
              },
              {
                title: "Cider and soda",
                task: async () =>
                  (data["ciderAndSoda"] = await categories["ciderAndSoda"](
                    browserInstance,
                  )),
                skip: () => !options.products["ciderAndSoda"],
              },
              {
                title: "Spirits",
                task: async () =>
                  (data["spirit"] = await categories["spirit"](
                    browserInstance,
                  )),
                skip: () => !options.products["spirit"],
              },
            ],
            {
              concurrent: true,
            },
          );
        },
      },
    ]);

    await tasks.run().catch((err) => {
      console.error("Tasks", err);
    });

    const endTime = Date.now();
    console.log("Time it took to scrape:", time(endTime - startTime));

    return data;
  },
};
