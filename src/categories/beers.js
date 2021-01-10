const fetch = require("../fetchProducts");

module.exports = async function beers() {
  try {
    const beerUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=beer";

    const beers = await fetch(beerUrl);

    return beers;
  } catch (err) {
    throw new Error("Error fetching beers => ", err);
  }
};
