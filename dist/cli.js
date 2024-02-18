#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/cli.ts
import fs from "fs";
import inquirer from "inquirer";

// src/index.ts
import { Listr } from "listr2";

// src/fetchProducts.ts
import fetch from "node-fetch";
var fetchProducts = (url) => __async(void 0, null, function* () {
  try {
    const res = yield fetch(url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,is;q=0.8",
        "content-type": "application/json; charset=utf-8"
      },
      method: "GET"
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const jsonData = yield res.json();
    const products = JSON.parse(jsonData.d).data;
    return products;
  } catch (error) {
    throw new Error("Failed to fetch products: " + error);
  }
});

// src/categories/fetcher.ts
function maxDigits(list) {
  let max = list[0].ProductID.toString().length;
  for (let index = 1; index < list.length; index++) {
    const digits = list[index].ProductID.toString().length;
    if (digits > max) {
      max = digits;
    }
  }
  return max;
}
function fetcher(category) {
  function inner() {
    return __async(this, null, function* () {
      try {
        const url = `https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=${category}`;
        const photoUrl = "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";
        const products = yield fetchProducts(url);
        const maxIdLength = maxDigits(products);
        return products.map((beverage) => {
          const productIdLength = beverage.ProductID.toString().length;
          return __spreadProps(__spreadValues({}, beverage), {
            ProductImageUrl: `${photoUrl}/${productIdLength < maxIdLength ? parseInt("0".repeat(maxIdLength - productIdLength)) : ""}${beverage.ProductID}_r.jpg`
          });
        });
      } catch (err) {
        console.log(`Error fetching ${category} => `, err);
      }
    });
  }
  return inner;
}

// src/categories/index.ts
var data = {
  beer: fetcher("beer" /* Beer */),
  red: fetcher("red" /* Red */),
  white: fetcher("white" /* White */),
  rose: fetcher("rose" /* Rose */),
  bubbly: fetcher("bubbly" /* Bubbly */),
  fortified: fetcher("fortified" /* Fortified */),
  ciderfruitandblends: fetcher("ciderfruitandblends" /* CiderFruitAndBlends */),
  sakeandmead: fetcher("sakeandmead" /* SakeAndMead */),
  strong: fetcher("strong" /* Strong */),
  aromatised: fetcher("aromatised" /* Aromatised */)
};
var categories_default = data;

// src/index.ts
var getProducts = function() {
  return __async(this, arguments, function* (options = {
    beer: true,
    red: true,
    white: true,
    rose: true,
    bubbly: true,
    fortified: true,
    ciderfruitandblends: true,
    sakeandmead: true,
    strong: true,
    aromatised: true
  }) {
    let data2 = {};
    const availableCategories = [
      "beer" /* Beer */,
      "red" /* Red */,
      "white" /* White */,
      "rose" /* Rose */,
      "bubbly" /* Bubbly */,
      "fortified" /* Fortified */,
      "ciderfruitandblends" /* CiderFruitAndBlends */,
      "sakeandmead" /* SakeAndMead */,
      "strong" /* Strong */,
      "aromatised" /* Aromatised */
    ];
    const tasks = new Listr(
      availableCategories.map((category) => ({
        title: category,
        task: () => __async(this, null, function* () {
          data2[category] = yield categories_default[category]();
        }),
        skip: () => !options[category]
      })),
      { concurrent: true }
    );
    yield tasks.run().catch((err) => {
      console.error("Tasks", err);
    });
    return data2;
  });
};

// src/cli.ts
function promptForOptions() {
  return __async(this, null, function* () {
    const answers = yield inquirer.prompt([
      {
        type: "checkbox",
        name: "products",
        message: "Pick what you want to fetch",
        choices: [
          { name: "Beers", value: "beer" /* Beer */ },
          { name: "Red wines", value: "red" /* Red */ },
          { name: "White wines", value: "white" /* White */ },
          { name: "Rose wines", value: "rose" /* Rose */ },
          { name: "Sparkling wines", value: "bubbly" /* Bubbly */ },
          { name: "Dessert wines", value: "fortified" /* Fortified */ },
          {
            name: "Ciders, fruit and blends",
            value: "ciderfruitandblends" /* CiderFruitAndBlends */
          },
          { name: "Sake and mead", value: "sakeandmead" /* SakeAndMead */ },
          { name: "Spirits", value: "strong" /* Strong */ },
          { name: "Aromatised wine", value: "aromatised" /* Aromatised */ }
        ],
        loop: false
      }
    ]);
    const options = answers.products.reduce(
      (acc, curr) => {
        acc[curr] = true;
        return acc;
      },
      {}
    );
    return options;
  });
}
(function cli() {
  return __async(this, null, function* () {
    const options = yield promptForOptions();
    const products = yield getProducts(options);
    fs.writeFile(
      "products.json",
      JSON.stringify(products, null, 2),
      "utf8",
      (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Fetch complete, see './products.json'");
      }
    );
  });
})();
//# sourceMappingURL=cli.js.map