import { NextRequest, NextResponse } from 'next/server'
import { createCustomerAccessToken } from '@/lib/shopify/customer'

const COOKIE_NAME = 'shopify_customer_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const result = await createCustomerAccessToken(email, password)

    if (result.errors?.length) {
      return NextResponse.json({ error: result.errors[0] }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, result.token!.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
