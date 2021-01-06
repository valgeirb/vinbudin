# vinbudin-scraper

> A scraper for www.vinbudin.is

## Why?

Vínbúðin does not provide an open API. This package can be used to analyse their product data or create something else from it.

## How?

This package extracts data from every product page on www.vinbudin.is and returns a JSON Object.

## Usage

Install from npm and save to your `package.json`:

    npm install vinbudin --save

## Examples

### Basic

```javascript
const vinbudin = require("vinbudin");

vinbudin.scrape().then((scrapedData) => {
  // Handle the scraped data
  console.log(scrapedData);
});

// You can also provide an options object to get specific data
vinbudin
  .scrape({
    products: {
      beer: true,
      redWine: true,
      whiteWine: true,
      roseWine: true,
      sparklingWine: true,
      dessertWine: true,
      ciderAndSoda: true,
      spirit: true,
    },
  })
  .then((scrapedData) => {
    // Handle the scraped data
    console.log(scrapedData);
  });
```

### Saving results to a local file

```javascript
const vinbudin = require("vinbudin");
const fs = require("fs");

async function vinbudinExample() {
  const products = await vinbudin.scrape();

  const scrapedData = {
    products,
  };

  fs.writeFile("data.json", JSON.stringify(scrapedData), "utf8", (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("Scrape complete, see './data.json'");
  });
}

vinbudinExample();
```
