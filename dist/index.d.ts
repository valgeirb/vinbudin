type Product = {
    ProductID: number;
    ProductName: string;
    ProductBottledVolume: number;
    ProductAlchoholVolume: number;
    ProductPrice: number;
    ProductCategory: {
        name: string;
        id: string[];
        taste: boolean;
        sweet: boolean;
        subCategories: null | string[];
    };
    ProductSubCategory: null | string;
    ProductCountryOfOrigin: string;
    ProductSpecialReserve: boolean;
    ProductOrganic: boolean;
    ProductContainerType: string;
    ProductPlaceOfOrigin: string;
    ProductDistrictOfOrigin: string;
    ProductWine: string;
    ProductInventory: number;
    ProductDateOnMarket: string;
    ProductIsTemporaryOnSale: boolean;
    ProductIsGift: boolean;
    ProductIsInThema: boolean;
    ProductIsAvailableInStores: boolean;
    ProductIsSpecialOrder: boolean;
    ProductStoreSelected: null | string;
    ProductTasteGroup: string;
    ProductTasteGroup2: string;
    ProductTasteGroup2Description: null | string;
    ProductPackagingClosing: string;
    ProductPackagingContainer: string;
    ProductSpecialMarking: string[];
    ProductSeasonCode: string;
    MinimumQuantity: number;
    UseMinimumQuantityAsUnit: boolean;
    IsSpecialOrderAndOutOfStock: boolean;
    ProductSearchGrape: string;
    ProductProducer: string;
    ProductShortDescription: string;
    ProductBackupInventory: number;
    ProductPackagingWeight: number;
    ProductCarbonFootprint: number;
    SupplierId: null | string;
    ProductAvailableUnits: string;
    ProductSaleStatus: string;
    ProductImageUrl: string;
};
declare enum Category {
    Beer = "beer",
    Red = "red",
    White = "white",
    Rose = "rose",
    Bubbly = "bubbly",
    Fortified = "fortified",
    CiderFruitAndBlends = "ciderfruitandblends",
    SakeAndMead = "sakeandmead",
    Strong = "strong",
    Aromatised = "aromatised"
}
type CategoryData = {
    [value in Category]?: Product[];
};
type CategoryOptions = {
    [value in Category]?: boolean;
};

declare const getProducts: (options?: CategoryOptions) => Promise<CategoryData>;

export { getProducts };
