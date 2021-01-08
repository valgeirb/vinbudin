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
      beer: true,
      redWine: true,
      whiteWine: true,
      roseWine: true,
      sparklingWine: true,
      dessertWine: true,
      ciderAndSoda: true,
      spirit: true,
    },
  ) {
    const startTime = Date.now();
    let data = {};
    let browser = await browserInstance;

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
                skip: () => !options["beer"],
              },
              {
                title: "Red wine",
                task: async () =>
                  (data["redWine"] = await categories["redWine"](
                    browserInstance,
                  )),
                skip: () => !options["redWine"],
              },
              {
                title: "White wine",
                task: async () =>
                  (data["whiteWine"] = await categories["whiteWine"](
                    browserInstance,
                  )),
                skip: () => !options["whiteWine"],
              },
              {
                title: "Rose wine",
                task: async () =>
                  (data["roseWine"] = await categories["roseWine"](
                    browserInstance,
                  )),
                skip: () => !options["roseWine"],
              },
              {
                title: "Sparkling wine",
                task: async () =>
                  (data["sparklingWine"] = await categories["sparklingWine"](
                    browserInstance,
                  )),
                skip: () => !options["sparklingWine"],
              },
              {
                title: "Dessert wine",
                task: async () =>
                  (data["dessertWine"] = await categories["dessertWine"](
                    browserInstance,
                  )),
                skip: () => !options["dessertWine"],
              },
              {
                title: "Cider and soda",
                task: async () =>
                  (data["ciderAndSoda"] = await categories["ciderAndSoda"](
                    browserInstance,
                  )),
                skip: () => !options["ciderAndSoda"],
              },
              {
                title: "Spirits",
                task: async () =>
                  (data["spirit"] = await categories["spirit"](
                    browserInstance,
                  )),
                skip: () => !options["spirit"],
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

    browser.close();

    const endTime = Date.now();
    console.log("Time it took to scrape:", time(endTime - startTime));

    return data;
  },
};
