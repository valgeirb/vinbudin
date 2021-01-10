const fetch = require("../fetchProducts");

module.exports = async function redWines() {
  try {
    const redWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=red";

    const redWines = await fetch(redWinesUrl);

    return redWines;
  } catch (err) {
    console.log("Error fetching red wines => ", err);
  }
};
