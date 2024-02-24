import { Product, productSchema } from '../types/types.js'
import { camelCaseKeys } from './utils/camelCaseKeys.js'
import { parse } from 'valibot'

export const fetchProducts = async (url: string): Promise<Product[]> => {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9,is;q=0.8',
        'content-type': 'application/json; charset=utf-8',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const jsonData = await response.json()

    const products: Product[] = JSON.parse(jsonData.d)
      .data.map((product: any) => camelCaseKeys(product))
      .map((product: any) => parse(productSchema, product))

    return products
  } catch (error) {
    throw new Error('Failed to fetch products: ' + error)
  }
}
