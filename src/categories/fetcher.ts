import { Category, Product } from '../../types/types.js'
import { fetchProducts } from '../fetchProducts.js'

// This function is used to find the maximum number of digits in the ProductID
function maxDigits(list: Product[]): number {
  let max = list[0].ProductID.toString().length
  for (let index = 1; index < list.length; index++) {
    const digits = list[index].ProductID.toString().length
    if (digits > max) {
      max = digits
    }
  }

  return max
}

export default function fetcher(category: Category): any {
  async function inner() {
    try {
      const url = `https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/DoSearch?skip=0&count=99999&category=${category}`
      const photoUrl =
        'https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original'

      const products = await fetchProducts(url)

      const maxIdLength = maxDigits(products)

      // Make sure the ProductImageUrl is correct by adding leading zeros to the ProductID
      return products.map((beverage: Product): Product => {
        const productIdLength = beverage.ProductID.toString().length

        return {
          ...beverage,
          ProductImageUrl: `${photoUrl}/${
            productIdLength < maxIdLength
              ? parseInt('0'.repeat(maxIdLength - productIdLength))
              : ''
          }${beverage.ProductID}_r.jpg`,
        }
      })
    } catch (err) {
      console.log(`Error fetching ${category} => `, err)
    }
  }

  return inner
}
