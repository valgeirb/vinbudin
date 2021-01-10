const fetch = require("../fetchProducts");

module.exports = async function dessertWines() {
  try {
    const dessertWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=fortified";

    const dessertWines = await fetch(dessertWinesUrl);

    return dessertWines;
  } catch (err) {
    console.log("Error fetching dessert wines => ", err);
  }
};
