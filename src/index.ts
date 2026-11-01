import categories from './categories/index.js'
import {
  Category,
  CategoryData,
  CategoryOptions,
  type ProductRequestOptions,
} from '../types/types.js'

export { getProductSnapshot } from './fetchProducts.js'
export { getStores } from './stores.js'
export { Category } from '../types/types.js'
export type {
  Product,
  ProductSnapshot,
  ProductRequestOptions,
  RequestOptions,
  Store,
  CategoryData,
  CategoryOptions,
} from '../types/types.js'

/**
 * Fetches products from the Vinbudin API
 * @param options - An object with keys for each category, and a boolean value to determine if the category should be fetched
 * @returns An object with keys for each category, and an array of products as the value
 */
export const getProducts = async function (
  options?: CategoryOptions,
  requestOptions?: ProductRequestOptions,
): Promise<CategoryData> {
  let data: CategoryData = {}
  const availableCategories: Category[] = [
    Category.Beer,
    Category.Red,
    Category.White,
    Category.Rose,
    Category.Bubbly,
    Category.Fortified,
    Category.CiderFruitAndBlends,
    Category.SakeAndMead,
    Category.Strong,
    Category.Aromatised,
  ]

  // Fetch data for each category by default, unless options are provided
  for (const category of availableCategories) {
    if (!options || options[category]) {
      data[category] = await categories[category](requestOptions)
    }
  }

  return data
}
