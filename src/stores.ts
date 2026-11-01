import { array, object, parse, string } from 'valibot'
import type { RequestOptions, Store } from '../types/types.js'
import { endpoint, request } from './request.js'

const schema = array(
  object({
    PostCode: string(),
    Name: string(),
    Address: string(),
    GPSN: string(),
    GPSW: string(),
  }),
)

export async function getStores(
  options: RequestOptions = {},
): Promise<Store[]> {
  const rows = parse(schema, await request(`${endpoint}GetAllShops`, options))
  const seen = new Set<string>()
  const coordinate = (value: string, max: number) => {
    if (!value.trim()) return null
    const number = Number(value)
    return Number.isFinite(number) && Math.abs(number) <= max ? number : null
  }
  return rows.map((row) => {
    if (
      !/^\d{3}$/.test(row.PostCode) ||
      !row.Name.trim() ||
      seen.has(row.PostCode)
    )
      throw new Error('Invalid or duplicate store code')
    seen.add(row.PostCode)
    return {
      code: row.PostCode,
      name: row.Name,
      address: row.Address,
      latitude: coordinate(row.GPSN, 90),
      longitude: coordinate(row.GPSW, 180),
    }
  })
}
