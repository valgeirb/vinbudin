const fetch = require("../fetchProducts");

module.exports = async function redWines() {
  try {
    const redWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=red";
    const redWinesPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const redWines = await fetch(redWinesUrl);

    return redWines.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${redWinesPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching red wines => ", err);
  }
};
