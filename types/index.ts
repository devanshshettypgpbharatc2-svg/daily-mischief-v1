// ─── Shopify Raw Types ────────────────────────────────────────────────────────

export interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions: { name: string; value: string }[]
  price: ShopifyMoneyV2
  compareAtPrice: ShopifyMoneyV2 | null
  sku: string
  image: ShopifyImage | null
}

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  tags: string[]
  productType: string
  vendor: string
  createdAt: string
  updatedAt: string
  priceRange: {
    minVariantPrice: ShopifyMoneyV2
    maxVariantPrice: ShopifyMoneyV2
  }
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyProductVariant }[] }
  options: ShopifyProductOption[]
  seo: { title: string; description: string }
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  image: ShopifyImage | null
  seo: { title: string; description: string }
  products: {
    edges: { node: ShopifyProduct }[]
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: {
    totalAmount: ShopifyMoneyV2
    subtotalAmount: ShopifyMoneyV2
    amountPerQuantity: ShopifyMoneyV2
  }
  merchandise: {
    id: string
    title: string
    selectedOptions: { name: string; value: string }[]
    product: {
      id: string
      handle: string
      title: string
      images: { edges: { node: ShopifyImage }[] }
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoneyV2
    totalAmount: ShopifyMoneyV2
    totalTaxAmount: ShopifyMoneyV2 | null
  }
  lines: { edges: { node: ShopifyCartLine }[] }
}

export interface ShopifyAPIResponse<T> {
  data?: T
  errors?: { message: string }[]
}

// ─── App Domain Types ─────────────────────────────────────────────────────────

export interface Money {
  amount: number
  currencyCode: string
  formatted: string
}

export interface Image {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

export interface ProductVariant {
  id: string
  title: string
  available: boolean
  quantityAvailable: number
  options: Record<string, string>
  price: Money
  compareAtPrice: Money | null
  sku: string
  image: Image | null
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  available: boolean
  tags: string[]
  type: string
  vendor: string
  images: Image[]
  variants: ProductVariant[]
  options: { id: string; name: string; values: string[] }[]
  priceRange: { min: Money; max: Money }
  seo: { title: string; description: string }
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  image: Image | null
  products: Product[]
  hasNextPage: boolean
  endCursor: string
  seo: { title: string; description: string }
}

export interface CartItem {
  lineId: string
  quantity: number
  product: { id: string; handle: string; title: string; image: Image | null }
  variant: { id: string; title: string; options: Record<string, string> }
  price: Money
  totalPrice: Money
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  items: CartItem[]
  subtotal: Money
  total: Money
  tax: Money | null
}

export type CartStatus = 'idle' | 'loading' | 'adding' | 'removing' | 'updating' | 'error'
export type SelectedOptions = Record<string, string>
