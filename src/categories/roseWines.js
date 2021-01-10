const fetch = require("../fetchProducts");

module.exports = async function roseWines() {
  try {
    const roseWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=rose";

    const roseWines = await fetch(roseWinesUrl);

    return roseWines;
  } catch (err) {
    console.log("Error fetching rose wines => ", err);
  }
};
