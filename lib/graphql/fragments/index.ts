export const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`

export const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    sku
    selectedOptions { name value }
    price { ...MoneyFragment }
    compareAtPrice { ...MoneyFragment }
    image { ...ImageFragment }
  }
`

export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    productType
    vendor
    createdAt
    updatedAt
    priceRange {
      minVariantPrice { ...MoneyFragment }
      maxVariantPrice { ...MoneyFragment }
    }
    images(first: 10) { edges { node { ...ImageFragment } } }
    variants(first: 100) { edges { node { ...ProductVariantFragment } } }
    options { id name values }
    seo { title description }
  }
`

export const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image { ...ImageFragment }
    seo { title description }
  }
`

export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...MoneyFragment }
      totalAmount { ...MoneyFragment }
      totalTaxAmount { ...MoneyFragment }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { ...MoneyFragment }
            subtotalAmount { ...MoneyFragment }
            amountPerQuantity { ...MoneyFragment }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              product {
                id
                handle
                title
                images(first: 1) { edges { node { ...ImageFragment } } }
              }
            }
          }
        }
      }
    }
  }
`
