const fetch = require("../fetchProducts");

module.exports = async function cidersAndSodas() {
  try {
    const cidersAndSodasUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=cidersoda";
    const cidersAndSodasPhotoUrl =
      "https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original";

    const cidersAndSodas = await fetch(cidersAndSodasUrl);

    return cidersAndSodas.map((beverage) => ({
      ...beverage,
      ProductImageUrl: `${cidersAndSodasPhotoUrl}/${beverage.ProductID}_r.jpg`,
    }));
  } catch (err) {
    console.log("Error fetching ciders and sodas => ", err);
  }
};
