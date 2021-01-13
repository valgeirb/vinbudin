const fetch = require("../fetchProducts");

module.exports = async function whiteWines() {
  try {
    const whiteWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=white";
    const whiteWinesPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const whiteWines = await fetch(whiteWinesUrl);

    return whiteWines.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${whiteWinesPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching white wines=> ", err);
  }
};
