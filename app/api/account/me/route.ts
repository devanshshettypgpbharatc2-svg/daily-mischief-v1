import { NextRequest, NextResponse } from 'next/server'
import { getCustomer } from '@/lib/shopify/customer'

const COOKIE_NAME = 'shopify_customer_token'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ customer: null }, { status: 401 })
  }
  try {
    const customer = await getCustomer(token)
    if (!customer) {
      const response = NextResponse.json({ customer: null }, { status: 401 })
      response.cookies.delete(COOKIE_NAME)
      return response
    }
    return NextResponse.json({ customer })
  } catch {
    return NextResponse.json({ customer: null }, { status: 500 })
  }
}
