const fetch = require("../fetchProducts");

module.exports = async function sparklingWines() {
  try {
    const sparklingWinesUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=bubbly";
    const sparklingWinesPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const sparklingWines = await fetch(sparklingWinesUrl);

    return sparklingWines.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${sparklingWinesPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching sparkling wines => ", err);
  }
};
