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

// src/utils/camelCaseKeys.ts
function camelCaseKeys(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(camelCaseKeys);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let camelCaseKey = key.replace(/ID/g, "Id");
      camelCaseKey = camelCaseKey.charAt(0).toLowerCase() + camelCaseKey.slice(1);
      return [camelCaseKey, camelCaseKeys(value)];
    })
  );
}

// src/fetchProducts.ts
var fetchProducts = (url) => __async(void 0, null, function* () {
  try {
    const response = yield fetch(url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,is;q=0.8",
        "content-type": "application/json; charset=utf-8"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const jsonData = yield response.json();
    const products = JSON.parse(jsonData.d).data.map(
      (product) => camelCaseKeys(product)
    );
    return products;
  } catch (error) {
    throw new Error("Failed to fetch products: " + error);
  }
});

// src/categories/fetcher.ts
function maxDigits(list) {
  let max = list[0].productId.toString().length;
  for (let index = 1; index < list.length; index++) {
    const digits = list[index].productId.toString().length;
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
          const productIdLength = beverage.productId.toString().length;
          return __spreadProps(__spreadValues({}, beverage), {
            productImageUrl: `${photoUrl}/${productIdLength < maxIdLength ? parseInt("0".repeat(maxIdLength - productIdLength)) : ""}${beverage.productId}_r.jpg`
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
var getProducts = function(options) {
  return __async(this, null, function* () {
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
    for (const category of availableCategories) {
      if (!options || options[category]) {
        data2[category] = yield categories_default[category]();
      }
    }
    return data2;
  });
};
export {
  getProducts
};
//# sourceMappingURL=index.js.map