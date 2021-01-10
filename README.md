<img width="75px" height="75px" align="right" alt="Inquirer Logo" src="https://raw.githubusercontent.com/valgeirb/vinbudin/main/assets/vinbudin.svg?sanitize=true" title="vinbudin"/>

# vinbudin

> Fetches product data from www.vinbudin.is

## Why?

Vínbúðin does not provide an open API. This package can be used to analyse their product data or create something else from it.

## How?

This package extracts data from www.vinbudin.is and returns a JSON Object.

## CLI

The quickest way to try this package out is using the CLI:

```
npx vinbudin
```

This will allow you to select what product categories you want to fetch. The data will be saved as a `products.json` file in the same folder that you ran the package.

## Usage

Install from npm and save to your `package.json`:

    npm install vinbudin --save

## Methods

### `vinbudin.get(products) -> promise`

Gets products from www.vinbudin.is

- **products** (Object) is an options object that you can optionally pass in if you want some subset of the data.

It looks like this:

```javascript
{
  beers: true,
  redWines: true,
  whiteWines: true,
  roseWines: true,
  sparklingWines: true,
  dessertWines: true,
  cidersAndSodas: true,
  spirits: true,
}
```

## Examples

### Basic

```javascript
const vinbudin = require("vinbudin");

vinbudin.get().then((products) => {
  // Handle the data
  console.log(products);
});

// You can also provide an options object to get specific data
vinbudin
  .get({
    beers: true,
    spirits: true,
  })
  .then((products) => {
    // Handle the data
    console.log(products);
  });
```

### Saving results to a local file

```javascript
const vinbudin = require("vinbudin");
const fs = require("fs");

async function vinbudinExample() {
  const products = await vinbudin.get();

  fs.writeFile(
    "data.json",
    JSON.stringify(products, null, 2),
    "utf8",
    (err) => {
      if (err) {
        return console.log(err);
      }

      console.log("Fetch complete, see './data.json'");
    },
  );
}

vinbudinExample();
```
