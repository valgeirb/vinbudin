import {
  transform,
  object,
  number,
  string,
  array,
  boolean,
  nullable,
  any,
  type Output,
} from 'valibot'

export const productSchema = transform(
  object({
    productId: number(),
    productName: string(),
    productBottledVolume: number(),
    productAlchoholVolume: number(),
    productPrice: number(),
    productFoodCategories: string(),
    productCategory: object({
      name: string(),
      id: array(string()),
      taste: boolean(),
      sweet: boolean(),
      subCategories: nullable(any()),
    }),
    productSubCategory: nullable(any()),
    productCountryOfOrigin: string(),
    productSpecialReserve: boolean(),
    productOrganic: boolean(),
    productContainerType: string(),
    productPlaceOfOrigin: string(),
    productDistrictOfOrigin: string(),
    productWine: string(),
    productInventory: number(),
    productYear: string(),
    productDateOnMarket: string(),
    productIsTemporaryOnSale: boolean(),
    productIsGift: boolean(),
    productIsInThema: boolean(),
    productIsAvailableInStores: boolean(),
    productIsSpecialOrder: boolean(),
    productStoreSelected: nullable(any()),
    productTasteGroup: string(),
    productTasteGroup2: string(),
    productTasteGroup2Description: nullable(any()),
    productPackagingClosing: string(),
    productPackagingContainer: string(),
    productSpecialMarking: array(any()),
    productSeasonCode: string(),
    minimumQuantity: number(),
    useMinimumQuantityAsUnit: boolean(),
    isSpecialOrderAndOutOfStock: boolean(),
    productSearchGrape: string(),
    productProducer: string(),
    productShortDescription: string(),
    productBackupInventory: number(),
    productPackagingWeight: number(),
    productCarbonFootprint: number(),
    supplierId: nullable(any()),
    productAvailableUnits: string(),
    productSaleStatus: string(),
  }),
  // Add the productImageUrl to the schema after the object has been created
  (input) => ({
    ...input,
    productImageUrl: string(),
  }),
)

export type Product = Output<typeof productSchema>

export enum Category {
  Beer = 'beer',
  Red = 'red',
  White = 'white',
  Rose = 'rose',
  Bubbly = 'bubbly',
  Fortified = 'fortified',
  CiderFruitAndBlends = 'ciderfruitandblends',
  SakeAndMead = 'sakeandmead',
  Strong = 'strong',
  Aromatised = 'aromatised',
}

export type CategoryData = {
  [value in Category]?: Product[]
}

export type CategoryOptions = {
  [value in Category]?: boolean
}

export type Fetcher = () => Promise<Product[] | undefined>

export type Fetchers = {
  [value in Category]: Fetcher
}
