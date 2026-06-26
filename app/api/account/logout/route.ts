import { NextRequest, NextResponse } from 'next/server'
import { deleteCustomerAccessToken } from '@/lib/shopify/customer'

const COOKIE_NAME = 'shopify_customer_token'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (token) {
    try {
      await deleteCustomerAccessToken(token)
    } catch {
      // ignore — still clear the cookie
    }
  }
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
