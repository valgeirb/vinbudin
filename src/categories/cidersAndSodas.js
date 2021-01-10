const fetch = require("../fetchProducts");

module.exports = async function cidersAndSodas() {
  try {
    const cidersAndSodasUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=cidersoda";

    const cidersAndSodas = await fetch(cidersAndSodasUrl);

    return cidersAndSodas;
  } catch (err) {
    console.log("Error fetching ciders and sodas => ", err);
  }
};
