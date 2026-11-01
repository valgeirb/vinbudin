import {
  Category,
  productSchema,
  type ProductRequestOptions,
  type ProductSnapshot,
} from '../types/types.js'
import { camelCaseKeys } from './utils/camelCaseKeys.js'
import { endpoint, request } from './request.js'
import { parse } from 'valibot'

/** A complete category snapshot, suitable for reconciliation by importers. */
export async function getProductSnapshot(
  category: `${Category}`,
  options: ProductRequestOptions = {},
): Promise<ProductSnapshot> {
  const storeCode = options.storeCode
  if (!Object.values(Category).includes(category as Category))
    throw new Error('Invalid product category')
  if (
    storeCode !== undefined &&
    (typeof storeCode !== 'string' || !/^\d{3}$/.test(storeCode))
  )
    throw new Error('Invalid store code')
  const url = new URL('DoSearch', endpoint)
  url.search = new URLSearchParams({
    skip: '0',
    count: '99999',
    category,
  }).toString()
  if (storeCode) url.searchParams.set('shop', storeCode)
  const fetchedAt = new Date().toISOString()
  const raw = await request(url.href, options)
  if (
    !raw ||
    typeof raw !== 'object' ||
    !('data' in raw) ||
    !Array.isArray(raw.data) ||
    !('total' in raw) ||
    typeof raw.total !== 'number' ||
    !Number.isSafeInteger(raw.total) ||
    raw.total < 0 ||
    raw.data.length !== raw.total
  ) {
    throw new Error('Incomplete or invalid Vínbúðin product snapshot')
  }
  const seen = new Set<number>()
  const products = raw.data.map((item) => {
    const product = parse(productSchema, camelCaseKeys(item), {
      abortEarly: true,
    })
    if (product.productCategory.name !== category)
      throw new Error('Product belongs to a different category')
    if (
      !Number.isSafeInteger(product.productId) ||
      product.productId <= 0 ||
      seen.has(product.productId)
    ) {
      throw new Error('Invalid or duplicate product ID')
    }
    seen.add(product.productId)
    const stock = product.productStoreSelected
    if (
      stock &&
      (stock.code !== storeCode ||
        !Number.isSafeInteger(stock.quantity) ||
        stock.quantity < 0)
    ) {
      throw new Error('Invalid stock or mismatched store code')
    }
    const photo = `${String(product.productId).padStart(5, '0')}_r.jpg`
    return {
      ...product,
      productImages: {
        original: `https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/original/${photo}`,
        medium: `https://www.vinbudin.is/Portaldata/1/Resources/vorumyndir/medium/${photo}`,
      },
    }
  })
  return {
    category,
    storeCode: storeCode ?? null,
    fetchedAt,
    total: raw.total,
    products,
  }
}
