const fetch = require("../fetchProducts");

module.exports = async function beers() {
  try {
    const beerUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=beer";
    const beerPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const beers = await fetch(beerUrl);

    return beers.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${beerPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    throw new Error("Error fetching beers => ", err);
  }
};
