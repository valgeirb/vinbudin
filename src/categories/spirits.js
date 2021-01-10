const fetch = require("../fetchProducts");

module.exports = async function spirits() {
  try {
    const spiritsUrl =
      "https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=strong";

    const spirits = await fetch(spiritsUrl);

    return spirits;
  } catch (err) {
    console.log("Error fetching spirits => ", err);
  }
};
