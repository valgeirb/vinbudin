const fetch = require("../fetchProducts");

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

module.exports = function productType(category) {
  async function inner() {
    try {
      const url = `https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=${category}`;
      const photoUrl =
        "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

      const products = await fetch(url);

      const maxIdLength = maxDigits(products);

      return products.map((beverage) => {
        const productIdLength = beverage.ProductID.toString().length;

        return {
          ...beverage,
          ProductImageUrl: `${photoUrl}/${
            productIdLength < maxIdLength
              ? parseInt("0".repeat(maxIdLength - productIdLength))
              : ""
          }${beverage.ProductID}_r.jpg`,
        };
      });
    } catch (err) {
      console.log(`Error fetching ${category} => `, err);
    }
  }
  return inner;
};
