export interface ProductDisplay {
  _id: string;
  basicInfo: {
    title: string;
    productCode: string;
    brand: string;
    category: string;
    description: string;
  };
  price: {
    regular: number;
    discounted: number;
  };
  stockStatus: string;
  stockQuantity: number;
  sold: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  rating: {
    average: number;
    count: number;
  };
  additionalInfo: {
    freeShipping: boolean;
    isFeatured: boolean;
    isOnSale: boolean;
    landingPageTemplate?: string;
  };
  createdAt: string;
  tags: string[];
}
