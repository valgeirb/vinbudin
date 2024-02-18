import fetch from 'node-fetch'
import { Product } from '../types/types.js'

export const fetchProducts = async (url: string): Promise<Product[]> => {
  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9,is;q=0.8',
        'content-type': 'application/json; charset=utf-8',
      },
      method: 'GET',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const jsonData: any = await res.json()
    const products: Product[] = JSON.parse(jsonData.d).data

    return products
  } catch (error: any) {
    throw new Error('Failed to fetch products: ' + error)
  }
}
