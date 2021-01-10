const fetch = require("node-fetch");

module.exports = async function fetchProducts(url) {
  let products;
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,is;q=0.8",
        "content-type": "application/json; charset=utf-8",
      },
      method: "GET",
      mode: "cors",
    });

    const jsonData = await res.json();
    products = JSON.parse(jsonData.d).data;
  } catch (error) {
    throw Error("fetchProducts", error);
  }

  return products;
};
