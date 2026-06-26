import { shopifyFetch } from './client'
import {
  CUSTOMER_CREATE,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_UPDATE,
} from '../graphql/mutations'
import { GET_CUSTOMER } from '../graphql/queries/customer'

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  defaultAddress?: {
    id: string
    address1: string
    address2?: string
    city: string
    province: string
    zip: string
    country: string
  }
  orders: {
    edges: Array<{
      node: {
        id: string
        orderNumber: number
        processedAt: string
        financialStatus: string
        fulfillmentStatus: string
        totalPrice: { amount: string; currencyCode: string }
        lineItems: {
          edges: Array<{
            node: {
              title: string
              quantity: number
              variant?: {
                title: string
                price: { amount: string; currencyCode: string }
                image?: { url: string; altText?: string; width: number; height: number }
              }
            }
          }>
        }
      }
    }>
  }
}

export async function createCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<{ customer?: { id: string; email: string }; errors?: string[] }> {
  const res = await shopifyFetch<{
    customerCreate: {
      customer: { id: string; email: string } | null
      customerUserErrors: Array<{ code: string; field: string[]; message: string }>
    }
  }>({
    query: CUSTOMER_CREATE,
    variables: { input: { email, password, firstName, lastName } },
    cache: 'no-store',
  })

  if (res.body.data?.customerCreate?.customerUserErrors?.length) {
    return { errors: res.body.data.customerCreate.customerUserErrors.map((e) => e.message) }
  }
  if (!res.body.data?.customerCreate?.customer) {
    return { errors: ['Failed to create account. Please try again.'] }
  }
  return { customer: res.body.data.customerCreate.customer }
}

export async function createCustomerAccessToken(
  email: string,
  password: string
): Promise<{ token?: CustomerAccessToken; errors?: string[] }> {
  const res = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null
      customerUserErrors: Array<{ code: string; field: string[]; message: string }>
    }
  }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: { input: { email, password } },
    cache: 'no-store',
  })

  if (res.body.data?.customerAccessTokenCreate?.customerUserErrors?.length) {
    return { errors: res.body.data.customerAccessTokenCreate.customerUserErrors.map((e) => e.message) }
  }
  const token = res.body.data?.customerAccessTokenCreate?.customerAccessToken
  if (!token) {
    return { errors: ['Invalid email or password.'] }
  }
  return { token }
}

export async function deleteCustomerAccessToken(
  accessToken: string
): Promise<void> {
  await shopifyFetch({
    query: CUSTOMER_ACCESS_TOKEN_DELETE,
    variables: { customerAccessToken: accessToken },
    cache: 'no-store',
  })
}

export async function getCustomer(accessToken: string): Promise<Customer | null> {
  const res = await shopifyFetch<{ customer: Customer | null }>({
    query: GET_CUSTOMER,
    variables: { customerAccessToken: accessToken },
    cache: 'no-store',
  })
  return res.body.data?.customer ?? null
}
