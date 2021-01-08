#!/usr/bin/env node

const fs = require("fs");
var inquirer = require("inquirer");
var { scrape } = require("./index");

async function promptForOptions() {
  const answers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "products",
      message: "Pick what you want to scrape",
      choices: [
        { name: "Beer", value: "beer" },
        { name: "Red wine", value: "redWine" },
        { name: "White wine", value: "whiteWine" },
        { name: "Rose wine", value: "roseWine" },
        { name: "Sparkling wine", value: "sparklingWine" },
        { name: "Dessert wine", value: "dessertWine" },
        { name: "Cider and soda", value: "ciderAndSoda" },
        { name: "Spirits", value: "spirit" },
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
  const products = await scrape(options);

  let scrapedData = {
    products,
  };

  fs.writeFile("products.json", JSON.stringify(scrapedData), "utf8", (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("Scrape complete, see './products.json'");
  });
})();
