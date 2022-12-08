const fetch = require("../fetchProducts");

module.exports = function productType(category) {
  async function inner() {
    try {
      const url =
        `https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=${category}`;
      const photoUrl =
        "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

      const dessertWines = await fetch(url);

      return dessertWines.map((beverage) => ({
        ...beverage,
        ProductImageUrl: `${photoUrl}/${beverage.ProductID}_r.jpg`,
      }));
    } catch (err) {
      console.log(`Error fetching ${category} => `, err);
    }
  }
  return inner;
};
