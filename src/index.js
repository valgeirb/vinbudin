const Listr = require("listr");
const categories = require("./categories");

module.exports = {
  get: async function (
    options = {
      beers: true,
      redWines: true,
      whiteWines: true,
      roseWines: true,
      sparklingWines: true,
      dessertWines: true,
      cidersAndSodas: true,
      spirits: true,
    },
  ) {
    let data = {};

    const tasks = new Listr(
      [
        {
          title: "Beers",
          task: async () => {
            data["beers"] = await categories["beers"]();
          },
          skip: () => !options["beers"],
        },
        {
          title: "Red wines",
          task: async () => {
            data["redWines"] = await categories["redWines"]();
          },
          skip: () => !options["redWines"],
        },
        {
          title: "White wines",
          task: async () => {
            data["whiteWines"] = await categories["whiteWines"]();
          },
          skip: () => !options["whiteWines"],
        },
        {
          title: "Rose wines",
          task: async () => {
            data["roseWines"] = await categories["roseWines"]();
          },
          skip: () => !options["roseWines"],
        },
        {
          title: "Sparkling wines",
          task: async () => {
            data["sparklingWines"] = await categories["sparklingWines"]();
          },
          skip: () => !options["sparklingWines"],
        },
        {
          title: "Dessert wines",
          task: async () => {
            data["dessertWines"] = await categories["dessertWines"]();
          },
          skip: () => !options["dessertWines"],
        },
        {
          title: "Ciders and sodas",
          task: async () => {
            data["cidersAndSodas"] = await categories["cidersAndSodas"]();
          },
          skip: () => !options["cidersAndSodas"],
        },
        {
          title: "Spirits",
          task: async () => {
            data["spirits"] = await categories["spirits"]();
          },
          skip: () => !options["spirits"],
        },
      ],
      {
        concurrent: true,
      },
    );

    await tasks.run().catch((err) => {
      console.error("Tasks", err);
    });

    return data;
  },
};
