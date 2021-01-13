const fetch = require("../fetchProducts");

module.exports = async function spirits() {
  try {
    const spiritsUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=strong";
    const spiritsPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const spirits = await fetch(spiritsUrl);

    return spirits.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${spiritsPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching spirits => ", err);
  }
};
