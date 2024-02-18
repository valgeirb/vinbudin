<img width="75px" height="75px" align="right" alt="Vinbudin Logo" src="https://raw.githubusercontent.com/valgeirb/vinbudin/main/assets/vinbudin.svg?sanitize=true" title="vinbudin"/>

# vinbudin

## Features

- ⚡ Fetches product data from www.vinbudin.is
- 🏷️ Fully typed

<img src="https://raw.githubusercontent.com/valgeirb/vinbudin/main/assets/vinbudin.gif">

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

## Setup

```bash
# pnpm
pnpm add -D vinbudin

# npm
npm i -D vinbudin

# yarn
yarn add -D vinbudin
```

## Methods

### `vinbudin.getProducts(products) -> promise`

Gets products from www.vinbudin.is

- **products** (Object) is an options object that you can optionally pass in if you want some subset of the data.

It looks like this:

```javascript
{
  beer: true,
  red: true,
  white: true,
  rose: true,
  bubbly: true,
  fortified: true,
  ciderfruitandblends: true,
  sakeandmead: true,
  strong: true,
  aromatised: true,
}
```

## Examples

### Basic

```ts
import { getProducts } from 'vinbudin'

getProducts().then((products) => {
  // Handle the data
  console.log(products)
})

// You can also provide an options object to get specific data
getProducts({
  beer: true,
  bubbly: true,
}).then((products) => {
  // Handle the data
  console.log(products)
})
```
