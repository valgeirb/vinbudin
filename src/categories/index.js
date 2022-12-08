const fetcher = require("./fetcher")
module.exports = {
  beers: fetcher("beer"),
  redWines: fetcher("red"),
  whiteWines: fetcher("white"),
  roseWines: fetcher("rose"),
  sparklingWines: fetcher("bubbly"),
  dessertWines: fetcher("fortified"),
  cidersAndSodas: fetcher("cidersoda"),
  spirits: fetcher("strong"),
};
