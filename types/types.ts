export type Product = {
  productId: number
  productName: string
  productBottledVolume: number
  productAlchoholVolume: number
  productPrice: number
  productCategory: {
    name: string
    id: string[]
    taste: boolean
    sweet: boolean
    subCategories: null | string[]
  }
  productSubCategory: null | string
  productCountryOfOrigin: string
  productSpecialReserve: boolean
  productOrganic: boolean
  productContainerType: string
  productPlaceOfOrigin: string
  productDistrictOfOrigin: string
  productWine: string
  productInventory: number
  productDateOnMarket: string
  productIsTemporaryOnSale: boolean
  productIsGift: boolean
  productIsInThema: boolean
  productIsAvailableInStores: boolean
  productIsSpecialOrder: boolean
  productStoreSelected: null | string
  productTasteGroup: string
  productTasteGroup2: string
  productTasteGroup2Description: null | string
  productPackagingClosing: string
  productPackagingContainer: string
  productSpecialMarking: string[]
  productSeasonCode: string
  minimumQuantity: number
  useMinimumQuantityAsUnit: boolean
  isSpecialOrderAndOutOfStock: boolean
  productSearchGrape: string
  productProducer: string
  productShortDescription: string
  productBackupInventory: number
  productPackagingWeight: number
  productCarbonFootprint: number
  supplierId: null | string
  productAvailableUnits: string
  productSaleStatus: string
  productImageUrl: string
}

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
