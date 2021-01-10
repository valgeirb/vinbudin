const fetch = require("../fetchProducts");

module.exports = async function whiteWines() {
  try {
    const whiteWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=white";

    const whiteWines = await fetch(whiteWinesUrl);

    return whiteWines;
  } catch (err) {
    console.log("Error fetching white wines=> ", err);
  }
};
