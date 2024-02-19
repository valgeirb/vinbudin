type Product = {
    productId: number;
    productName: string;
    productBottledVolume: number;
    productAlchoholVolume: number;
    productPrice: number;
    productCategory: {
        name: string;
        id: string[];
        taste: boolean;
        sweet: boolean;
        subCategories: null | string[];
    };
    productSubCategory: null | string;
    productCountryOfOrigin: string;
    productSpecialReserve: boolean;
    productOrganic: boolean;
    productContainerType: string;
    productPlaceOfOrigin: string;
    productDistrictOfOrigin: string;
    productWine: string;
    productInventory: number;
    productDateOnMarket: string;
    productIsTemporaryOnSale: boolean;
    productIsGift: boolean;
    productIsInThema: boolean;
    productIsAvailableInStores: boolean;
    productIsSpecialOrder: boolean;
    productStoreSelected: null | string;
    productTasteGroup: string;
    productTasteGroup2: string;
    productTasteGroup2Description: null | string;
    productPackagingClosing: string;
    productPackagingContainer: string;
    productSpecialMarking: string[];
    productSeasonCode: string;
    minimumQuantity: number;
    useMinimumQuantityAsUnit: boolean;
    isSpecialOrderAndOutOfStock: boolean;
    productSearchGrape: string;
    productProducer: string;
    productShortDescription: string;
    productBackupInventory: number;
    productPackagingWeight: number;
    productCarbonFootprint: number;
    supplierId: null | string;
    productAvailableUnits: string;
    productSaleStatus: string;
    productImageUrl: string;
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

/**
 * Fetches products from the Vinbudin API
 * @param options - An object with keys for each category, and a boolean value to determine if the category should be fetched
 * @returns An object with keys for each category, and an array of products as the value
 */
declare const getProducts: (options?: CategoryOptions) => Promise<CategoryData>;

export { getProducts };
