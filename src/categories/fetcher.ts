import { Category, type Fetcher } from '../../types/types.js'
import { getProductSnapshot } from '../fetchProducts.js'

export default function fetcher(category: Category): Fetcher {
  return async (options) =>
    (await getProductSnapshot(category, options)).products
}
