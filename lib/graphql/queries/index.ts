import { PRODUCT_FRAGMENT, COLLECTION_FRAGMENT, MONEY_FRAGMENT, IMAGE_FRAGMENT, PRODUCT_VARIANT_FRAGMENT } from '../fragments'

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`

export const GET_ALL_PRODUCT_HANDLES = `
  query GetAllProductHandles {
    products(first: 250) {
      edges { node { handle } }
    }
  }
`

export const GET_PRODUCT_RECOMMENDATIONS = `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      ...CollectionFragment
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            handle
            title
            availableForSale
            tags
            priceRange {
              minVariantPrice { ...MoneyFragment }
              maxVariantPrice { ...MoneyFragment }
            }
            images(first: 2) { edges { node { ...ImageFragment } } }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  price { ...MoneyFragment }
                  compareAtPrice { ...MoneyFragment }
                  selectedOptions { name value }
                }
              }
            }
            options { id name values }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

export const GET_ALL_COLLECTION_HANDLES = `
  query GetAllCollectionHandles {
    collections(first: 250) {
      edges { node { handle } }
    }
  }
`

export const GET_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFragment
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      totalCount
      edges {
        node {
          ... on Product {
            id
            handle
            title
            availableForSale
            priceRange {
              minVariantPrice { ...MoneyFragment }
            }
            images(first: 1) { edges { node { ...ImageFragment } } }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`
