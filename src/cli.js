#!/usr/bin/env node

const fs = require("fs");
var inquirer = require("inquirer");
var { get } = require("./index");

async function promptForOptions() {
  const answers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "products",
      message: "Pick what you want to fetch",
      choices: [
        { name: "Beers", value: "beers" },
        { name: "Red wines", value: "redWines" },
        { name: "White wines", value: "whiteWines" },
        { name: "Rose wines", value: "roseWines" },
        { name: "Sparkling wines", value: "sparklingWines" },
        { name: "Dessert wines", value: "dessertWines" },
        { name: "Ciders and sodas", value: "cidersAndSodas" },
        { name: "Spirits", value: "spirits" },
      ],
      loop: false,
    },
  ]);

  const options = answers.products.reduce((acc, curr) => {
    acc[curr] = true;

    return acc;
  }, {});

  return options;
}

(async function cli() {
  const options = await promptForOptions();
  const products = await get(options);

  fs.writeFile("products.json", JSON.stringify(products), "utf8", (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("Scrape complete, see './products.json'");
  });
})();
