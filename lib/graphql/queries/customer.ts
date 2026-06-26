export const GET_CUSTOMER = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      createdAt
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount currencyCode }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    price { amount currencyCode }
                    image { url altText width height }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
