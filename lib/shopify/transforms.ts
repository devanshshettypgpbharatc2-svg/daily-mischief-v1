import type {
  ShopifyProduct, ShopifyCollection, ShopifyCart, ShopifyCartLine,
  ShopifyProductVariant, ShopifyImage, ShopifyMoneyV2,
  Product, Collection, Cart, CartItem, Image, Money, ProductVariant,
} from '@/types'

export function transformMoney(m: ShopifyMoneyV2): Money {
  const amount = parseFloat(m.amount)
  return {
    amount,
    currencyCode: m.currencyCode,
    formatted: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: m.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount),
  }
}

export function transformImage(img: ShopifyImage): Image {
  return {
    id: img.id,
    url: img.url,
    alt: img.altText ?? '',
    width: img.width,
    height: img.height,
  }
}

export function transformVariant(v: ShopifyProductVariant): ProductVariant {
  return {
    id: v.id,
    title: v.title,
    available: v.availableForSale,
    quantityAvailable: v.quantityAvailable ?? 0,
    options: (v.selectedOptions ?? []).reduce<Record<string, string>>(
      (acc, o) => ({ ...acc, [o.name]: o.value }),
      {}
    ),
    price: transformMoney(v.price),
    compareAtPrice: v.compareAtPrice ? transformMoney(v.compareAtPrice) : null,
    sku: v.sku,
    image: v.image ? transformImage(v.image) : null,
  }
}

export function transformProduct(p: ShopifyProduct): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    available: p.availableForSale,
    tags: p.tags,
    type: p.productType,
    vendor: p.vendor,
    images: (p.images?.edges ?? []).map(e => transformImage(e.node)),
    variants: (p.variants?.edges ?? []).map(e => transformVariant(e.node)),
    options: p.options,
    priceRange: {
      min: transformMoney(p.priceRange.minVariantPrice),
      max: transformMoney(p.priceRange.maxVariantPrice),
    },
    seo: {
      title: p.seo?.title || p.title,
      description: p.seo?.description || p.description,
    },
  }
}

export function transformCollection(c: ShopifyCollection): Collection {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description,
    descriptionHtml: c.descriptionHtml,
    image: c.image ? transformImage(c.image) : null,
    products: c.products.edges.map(e => transformProduct(e.node as ShopifyProduct)),
    hasNextPage: c.products.pageInfo.hasNextPage,
    endCursor: c.products.pageInfo.endCursor,
    seo: {
      title: c.seo?.title || c.title,
      description: c.seo?.description || c.description,
    },
  }
}

export function transformCartLine(line: ShopifyCartLine): CartItem {
  const img = line.merchandise.product.images.edges[0]?.node ?? null
  return {
    lineId: line.id,
    quantity: line.quantity,
    product: {
      id: line.merchandise.product.id,
      handle: line.merchandise.product.handle,
      title: line.merchandise.product.title,
      image: img ? transformImage(img) : null,
    },
    variant: {
      id: line.merchandise.id,
      title: line.merchandise.title,
      options: line.merchandise.selectedOptions.reduce<Record<string, string>>(
        (acc, o) => ({ ...acc, [o.name]: o.value }),
        {}
      ),
    },
    price: transformMoney(line.cost.amountPerQuantity),
    totalPrice: transformMoney(line.cost.totalAmount),
  }
}

export function transformCart(c: ShopifyCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    items: c.lines.edges.map(e => transformCartLine(e.node)),
    subtotal: transformMoney(c.cost.subtotalAmount),
    total: transformMoney(c.cost.totalAmount),
    tax: c.cost.totalTaxAmount ? transformMoney(c.cost.tota