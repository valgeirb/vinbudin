const browserObject = require("./browser");
const beers = require("./beers");

const browserInstance = browserObject.startBrowser();

module.exports = {
  product: function () {},
  scrape: function (options) {
    return beers(browserInstance);
  },
};
