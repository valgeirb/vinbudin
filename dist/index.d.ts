export interface ProductCategory {
  name: string;
  id: string[];
  taste: boolean;
  sweet: boolean;
}

export interface Beverage {
  ProductID: number;
  ProductName: string;
  ProductBottledVolume: number;
  ProductAlchoholVolume: number;
  ProductPrice: number;
  ProductFoodCategories: string;
  ProductCategory: ProductCategory;
  ProductSubCategory: null;
  ProductCountryOfOrigin: string;
  ProductSpecialReserve: boolean;
  ProductOrganic: boolean;
  ProductContainerType: string;
  ProductPlaceOfOrigin: string;
  ProductDistrictOfOrigin: string;
  ProductWine: string;
  ProductInventory: number
  ProductYear: string;
  ProductDateOnMarket: string;
  ProductIsTemporaryOnSale: boolean;
  ProductIsGift: boolean;
  ProductIsInThema: boolean;
  ProductIsAvailableInStores: boolean;
  ProductIsSpecialOrder: boolean;
  ProductStoreSelected: null;
  ProductTasteGroup: string;
  ProductTasteGroup2: string;
  ProductTasteGroup2Description: null;
  ProductPackagingClosing: string;
  ProductSpecialMarking: string[];
  ProductSeasonCode: string;
  MinimumQuantity: number
  UseMinimumQuantityAsUnit: boolean;
  IsSpecialOrderAndOutOfStock: boolean;
  ProductSearchGrape: string;
  ProductProducer: string;
  ProductShortDescription: string;
  ProductBackupInventory: number
  ProductPackagingWeight: number;
  ProductCarbonFootprint: number;
  ProductAvailableUnits: string;
  ProductImageUrl: string;
}

export function get(options?: {
  beers: boolean;
  redWines: boolean;
  whiteWines: boolean;
  roseWines: boolean;
  sparklingWines: boolean;
  dessertWines: boolean;
  cidersAndSodas: boolean;
  spirits: boolean;
}): Promise<{}>;
//# sourceMappingURL=index.d.ts.map
