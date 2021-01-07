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

export async function cli() {
  const options = await promptForOptions();
  await scrape(options);
}
