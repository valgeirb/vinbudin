const fetch = require("../fetchProducts");

module.exports = async function roseWines() {
  try {
    const roseWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=rose";
    const roseWinesPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const roseWines = await fetch(roseWinesUrl);

    return roseWines.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${roseWinesPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching rose wines => ", err);
  }
};
