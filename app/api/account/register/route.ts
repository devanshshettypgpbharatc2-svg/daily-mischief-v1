import { NextRequest, NextResponse } from 'next/server'
import { createCustomer, createCustomerAccessToken } from '@/lib/shopify/customer'

const COOKIE_NAME = 'shopify_customer_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    if (password.length < 5) {
      return NextResponse.json({ error: 'Password must be at least 5 characters.' }, { status: 400 })
    }

    // Create the customer
    const createResult = await createCustomer(email, password, firstName, lastName)
    if (createResult.errors?.length) {
      return NextResponse.json({ error: createResult.errors[0] }, { status: 400 })
    }

    // Auto-login after registration
    const tokenResult = await createCustomerAccessToken(email, password)
    if (tokenResult.errors?.length || !tokenResult.token) {
      // Account created but login failed — redirect to login page
      return NextResponse.json({ success: true, redirect: '/account/login' })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, tokenResult.token.accessToken, {
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
