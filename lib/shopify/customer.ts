import { shopifyFetch } from './client'
import {
  CUSTOMER_CREATE,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
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
  try {
    const data = await shopifyFetch<{
      customerCreate: {
        customer: { id: string; email: string } | null
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>
      }
    }>(CUSTOMER_CREATE, { input: { email, password, firstName, lastName } }, { cache: 'no-store' })

    if (data.customerCreate?.customerUserErrors?.length) {
      return { errors: data.customerCreate.customerUserErrors.map((e) => e.message) }
    }
    if (!data.customerCreate?.customer) {
      return { errors: ['Failed to create account. Please try again.'] }
    }
    return { customer: data.customerCreate.customer }
  } catch (err) {
    return { errors: [(err as Error).message || 'Something went wrong.'] }
  }
}

export async function createCustomerAccessToken(
  email: string,
  password: string
): Promise<{ token?: CustomerAccessToken; errors?: string[] }> {
  try {
    const data = await shopifyFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>
      }
    }>(CUSTOMER_ACCESS_TOKEN_CREATE, { input: { email, password } }, { cache: 'no-store' })

    if (data.customerAccessTokenCreate?.customerUserErrors?.length) {
      return { errors: data.customerAccessTokenCreate.customerUserErrors.map((e) => e.message) }
    }
    const token = data.customerAccessTokenCreate?.customerAccessToken
    if (!token) {
      return { errors: ['Invalid email or password.'] }
    }
    return { token }
  } catch {
    return { errors: ['Invalid email or password.'] }
  }
}

export async function deleteCustomerAccessToken(accessToken: string): Promise<void> {
  try {
    await shopifyFetch(
      CUSTOMER_ACCESS_TOKEN_DELETE,
      { customerAccessToken: accessToken },
      { cache: 'no-store' }
    )
  } catch {
    // Ignore — token may already be expired
  }
}

export async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const data = await shopifyFetch<{ customer: Customer | n