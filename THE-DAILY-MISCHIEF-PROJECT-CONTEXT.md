# The Daily Mischief — Complete Project Context

> **Use this document to resume work in a new chat.** It covers every decision, every file, every bug that was fixed, and the current state of the codebase as of June 2026.

---

## 1. What This Project Is

**The Daily Mischief** is a dark, editorial, headless Shopify storefront. The concept: one clothing/lifestyle product drops every 24 hours at its lowest price — no restocks, no second chances.

**Live store domain:** `thedailymischief.store`  
**Shopify store:** `a5d5y4-ap.myshopify.com`  
**Deployed on:** Vercel (connected to the GitHub repo)  
**Local repo path:** `C:\Users\Asus\OneDrive\Desktop\daily-mischief-v1`

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Backend | Shopify Storefront API (GraphQL) |
| Admin API | Shopify Admin API (via MCP connector) |
| Hosting | Vercel |
| Payments (planned) | Razorpay (via Shopify Payments integration) |

### Environment Variables (set in Vercel + local `.env.local`)

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=a5d5y4-ap.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=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
SHOPIFY_STOREFRONT_ACCESS_TOKEN=(public token, fallback)
SHOPIFY_API_VERSION=2024-10
```

The private token is sent as `Shopify-Storefront-Private-Token` header. This is a **server-side only** token — never exposed to the browser.

---

## 3. Shopify Store Setup

### Store identifiers
- **Domain:** `a5d5y4-ap.myshopify.com`
- **Headless channel publication ID:** `gid://shopify/Publication/200378417410` (called "The Daily Mischief Headless")
- **MCP connector ID:** `14e1c90b-f48a-4720-a297-3559b85f349b`

### Why the Headless channel matters
Shopify's Headless channel has its own **separate product catalog**. The Storefront API token only sees products/collections that have been explicitly published to the Headless channel via `publishablePublish`. Simply creating a product in Shopify admin does NOT make it visible to the storefront — you must also call:

```graphql
mutation {
  publishablePublish(
    id: "gid://shopify/Product/XXX",
    input: [{ publicationId: "gid://shopify/Publication/200378417410" }]
  ) {
    userErrors { message }
  }
}
```

This applies to **both products AND collections**.

### Collections (all published to Headless channel)

| Handle | Title | Shopify GID |
|---|---|---|
| `todays-mischief` | Today's Mischief | `gid://shopify/Collection/486355894530` |
| `wardrobe` | Wardrobe | (check Shopify admin) |
| `home` | Home | (check Shopify admin) |
| `oddities` | Oddities | (check Shopify admin) |

### Products (17 total, all published to Headless channel)

All 17 products are active and assigned to their respective collections. The Phantom Overshirt (`gid://shopify/Product/9472131760386`) is in the `todays-mischief` collection.

Product images use Shopify CDN URLs (`cdn.shopify.com`) — Unsplash images were used during development and are also whitelisted in `next.config.js`.

---

## 4. Architecture: How the Storefront Works

```
Browser
  │
  ├── Next.js App Router (app/)
  │     ├── Server Components → call lib/shopify/* → Shopify Storefront API
  │     │     └── Responses cached with ISR (revalidate: 3600) + cache tags
  │     └── Client Components → call /api/* routes → Shopify Storefront API
  │
  ├── API Routes (app/api/)
  │     ├── /api/cart/*       → cart mutations (create, add, update, remove)
  │     ├── /api/search       → product search
  │     ├── /api/account/*    → customer auth (login, register, logout, me)
  │     └── /api/revalidate   → ISR cache busting
  │
  └── Shopify Storefront API
        └── https://a5d5y4-ap.myshopify.com/api/2024-10/graphql.json
```

### ISR + Cache Tags
Product/collection pages use `force-cache` with Next.js cache tags (`products`, `collections`, `product:{handle}`, `collection:{handle}`). To bust the cache after publishing new products:

```
GET https://thedailymischief.store/api/revalidate
```

This calls `revalidateTag('products')` and `revalidateTag('collections')`, forcing Next.js to re-fetch from Shopify on the next request.

**Important:** Vercel's Data Cache **persists across deployments**. Simply redeploying does NOT clear cached Shopify responses. You must call `/api/revalidate` after adding/updating products.

---

## 5. File Structure

```
daily-mischief-v1/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, CartProvider
│   ├── page.tsx                      # Homepage (HeroProduct + FeaturedCollection)
│   ├── not-found.tsx                 # Custom 404 ("This one left without saying goodbye")
│   ├── about/page.tsx                # Brand story page
│   ├── editorial/page.tsx            # The Journal (4 editorial articles)
│   ├── search/page.tsx               # Live search with debounce
│   ├── contact/page.tsx              # Contact form (client component)
│   ├── shipping/page.tsx             # Shipping info
│   ├── returns/page.tsx              # Returns policy
│   ├── account/
│   │   ├── page.tsx                  # Dashboard (redirects to login if not authed)
│   │   ├── login/page.tsx            # Login form
│   │   └── register/page.tsx         # Registration form
│   ├── shop/
│   │   ├── collections/[handle]/page.tsx  # Collection pages (ISR)
│   │   └── products/[handle]/page.tsx     # Product detail pages (ISR)
│   └── api/
│       ├── cart/route.ts             # Cart API (POST for all cart mutations)
│       ├── search/route.ts           # GET /api/search?q=...
│       ├── revalidate/route.ts       # GET/POST to bust ISR cache
│       ├── debug/route.ts            # Dev debugging endpoint
│       └── account/
│           ├── login/route.ts        # POST → create Shopify customer token → set cookie
│           ├── register/route.ts     # POST → create customer + auto-login
│           ├── logout/route.ts       # POST → delete token + clear cookie
│           └── me/route.ts           # GET → fetch customer data from Shopify
│
├── lib/
│   ├── graphql/
│   │   ├── fragments/index.ts        # All GraphQL fragments (standalone — no nesting!)
│   │   ├── queries/index.ts          # All product/collection queries
│   │   ├── queries/customer.ts       # GET_CUSTOMER query
│   │   └── mutations/index.ts        # Cart mutations + Customer mutations
│   └── shopify/
│       ├── client.ts                 # shopifyFetch() — the core fetcher
│       ├── products.ts               # getProductByHandle, getCollectionByHandle, etc.
│       ├── cart.ts                   # createCart, addToCart, updateCart, removeFromCart
│       ├── customer.ts               # createCustomer, login, logout, getCustomer
│       ├── transforms.ts             # transformProduct, transformCollection, transformVariant
│       └── index.ts                  # Re-exports everything
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                   # Fixed nav with countdown timer + cart button + Account link
│   │   └── Footer.tsx                # 4-column footer
│   ├── cart/
│   │   └── CartDrawer.tsx            # Slide-in cart with quantity controls + checkout CTA
│   ├── product/
│   │   ├── ProductCard.tsx           # ProductCard + ProductGrid components
│   │   └── AddToCartForm.tsx         # Variant selector + Add to Cart button
│   ├── skeletons/index.tsx           # Loading skeletons
│   └── ui/
│       ├── Buttons.tsx
│       └── MischiefImage.tsx
│
├── hooks/
│   ├── useCart.ts                    # Cart context + actions
│   └── useCountdown.ts              # 24-hour countdown timer for nav
│
├── next.config.js                    # Image domains: cdn.shopify.com + images.unsplash.com
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. The `shopifyFetch` Function (CRITICAL — Read This)

**Location:** `lib/shopify/client.ts`

```typescript
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: { cache?: RequestCache; tags?: string[]; revalidate?: number } = {}
): Promise<T>
```

- Takes **positional arguments**: `(query, variables, options)` — NOT an object
- Returns `json.data` directly — NOT `{ body: { data: ... } }`
- Uses `Shopify-Storefront-Private-Token` header (server-only)
- Throws on HTTP errors AND GraphQL errors

### Correct usage:
```typescript
const data = await shopifyFetch<{ product: ShopifyProduct }>(
  GET_PRODUCT_BY_HANDLE,
  { handle: 'my-product' },
  { tags: ['products'] }
)
// data.product is ShopifyProduct
```

---

## 7. GraphQL Fragment Architecture (CRITICAL — Read This)

**The Shopify Storefront API will reject your request if:**
1. Any fragment is **defined more than once** in the same query string
2. Any fragment is **defined but not used** in the query body

### The Solution: Standalone Fragments

All fragments in `lib/graphql/fragments/index.ts` are **standalone** — they do NOT embed other fragments via template literal interpolation. Each query that needs a fragment includes it exactly once.

**Example of what NOT to do (causes duplicates):**
```typescript
// WRONG — ProductVariantFragment embeds MoneyFragment and ImageFragment
export const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFragment on ProductVariant {
    price { ...MoneyFragment }
    image { ...ImageFragment }
  }
  ${MONEY_FRAGMENT}    ← this causes MONEY_FRAGMENT to appear twice in queries
  ${IMAGE_FRAGMENT}    ← same problem
`
```

**Correct approach:**
```typescript
// RIGHT — fragment is self-contained, no embedding
export const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFragment on ProductVariant {
    price { ...MoneyFragment }
    image { ...ImageFragment }
  }
`

// Each query lists all needed fragments exactly once:
export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFragment }
  }
  ${PRODUCT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`
```

### Fragment dependency chart (include ALL these for each query):

| Query | Fragments required |
|---|---|
| `GET_PRODUCT_BY_HANDLE` | `PRODUCT_FRAGMENT`, `MONEY_FRAGMENT`, `IMAGE_FRAGMENT`, `PRODUCT_VARIANT_FRAGMENT` |
| `GET_PRODUCT_RECOMMENDATIONS` | Same as above |
| `GET_COLLECTION_BY_HANDLE` | `COLLECTION_FRAGMENT`, `MONEY_FRAGMENT`, `IMAGE_FRAGMENT` (**NOT** `PRODUCT_VARIANT_FRAGMENT` — uses inline variant fields) |
| `GET_ALL_COLLECTIONS` | `COLLECTION_FRAGMENT`, `IMAGE_FRAGMENT` |
| `CREATE_CART`, `GET_CART`, etc. | `CART_FRAGMENT`, `MONEY_FRAGMENT`, `IMAGE_FRAGMENT` |

**`GET_COLLECTION_BY_HANDLE` does NOT use `PRODUCT_VARIANT_FRAGMENT`** — even though it fetches variant data, it does so with inline fields (not spreading the fragment). Including `PRODUCT_VARIANT_FRAGMENT` there will cause a "Fragment defined but not used" error.

---

## 8. Cart System

The cart is managed client-side via `useCart` hook (`hooks/useCart.ts`), backed by API routes.

### Flow:
1. Cart ID is stored in a cookie (`shopify_cart_id`)
2. On first add-to-cart, `CREATE_CART` mutation runs → cart ID saved to cookie
3. Subsequent cart operations use the saved cart ID
4. `CartDrawer.tsx` reads `cart.checkoutUrl` from Shopify → "Proceed to Checkout" is a plain `<a>` tag pointing there
5. Checkout happens on Shopify's hosted checkout (`checkout.shopify.com`) — no custom checkout code needed

### Cart mutations (all in `lib/graphql/mutations/index.ts`):
- `CREATE_CART`
- `GET_CART`
- `ADD_TO_CART`
- `UPDATE_CART_LINES`
- `REMOVE_FROM_CART`

All 5 end with `${CART_FRAGMENT} ${MONEY_FRAGMENT} ${IMAGE_FRAGMENT}`.

---

## 9. Customer Account System

Authentication uses Shopify's Storefront Customer API with HTTP-only cookies.

### Session storage
The Shopify customer access token is stored in a cookie named `shopify_customer_token` (HttpOnly, SameSite: Lax, 30-day max-age).

### API routes

| Route | Method | What it does |
|---|---|---|
| `/api/account/register` | POST | Calls `customerCreate` mutation, then auto-logs in |
| `/api/account/login` | POST | Calls `customerAccessTokenCreate`, sets cookie |
| `/api/account/logout` | POST | Calls `customerAccessTokenDelete`, clears cookie |
| `/api/account/me` | GET | Reads cookie, calls `customer` query, returns customer data |

### GraphQL mutations (in `lib/graphql/mutations/index.ts`):
- `CUSTOMER_CREATE`
- `CUSTOMER_ACCESS_TOKEN_CREATE`
- `CUSTOMER_ACCESS_TOKEN_DELETE`
- `CUSTOMER_UPDATE`

### GraphQL query (in `lib/graphql/queries/customer.ts`):
- `GET_CUSTOMER` — fetches customer profile + last 20 orders with line items

### Customer service functions (in `lib/shopify/customer.ts`):
- `createCustomer(email, password, firstName?, lastName?)`
- `createCustomerAccessToken(email, password)`
- `deleteCustomerAccessToken(accessToken)`
- `getCustomer(accessToken)`

### Account pages:
- `/account/login` — login form, redirects to `/account` on success
- `/account/register` — registration form, auto-logs in after creating account
- `/account` — dashboard showing name, email, order history with fulfillment status; redirects to `/account/login` if no valid session

---

## 10. Pages Reference

### Public pages (no auth required)

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Homepage: HeroProduct (todays-mischief collection) + FeaturedCollection (wardrobe) |
| `/about` | `app/about/page.tsx` | Brand story, values, stats |
| `/editorial` | `app/editorial/page.tsx` | The Journal — 4 hardcoded editorial articles |
| `/search` | `app/search/page.tsx` | Live search with 350ms debounce, calls `/api/search` |
| `/contact` | `app/contact/page.tsx` | Contact form (client component, currently simulated send) |
| `/shipping` | `app/shipping/page.tsx` | Shipping rates table |
| `/returns` | `app/returns/page.tsx` | Returns policy |
| `/shop/collections/[handle]` | `app/shop/collections/[handle]/page.tsx` | Collection page, ISR |
| `/shop/products/[handle]` | `app/shop/products/[handle]/page.tsx` | Product page, ISR |

### Account pages

| URL | File | Notes |
|---|---|---|
| `/account` | `app/account/page.tsx` | Dashboard, redirects to login if no session |
| `/account/login` | `app/account/login/page.tsx` | Login form |
| `/account/register` | `app/account/register/page.tsx` | Registration form |

### Pages mentioned in footer but NOT yet built
- `/hall-of-mischief` — planned: UGC/community page
- `/graveyard` — planned: archive of past drops
- `/sizing` — planned: size guide
- `/privacy` — planned: privacy policy
- `/terms` — planned: terms of service

---

## 11. Design System

The site uses a **dark editorial aesthetic** — almost black background, sparse typography, crimson red as the only accent.

### Color palette
```
Background:     #111111 (main), #0d0506 (darkest)
Text:           white with opacity variants (white/20, white/35, white/45, white/55, white/70)
Accent:         #B5121B (crimson red — used for labels, CTAs hover states, badges)
Border:         white/[0.08] (subtle dividers)
```

### Typography
- **Serif** (`font-serif`): headings, hero text, product titles — light weight (300), wide tracking
- **Sans** (`font-sans`): labels, body copy, nav — tiny sizes (9–12px), heavy letter-spacing on labels (`tracking-[0.4em]`)
- Label pattern: `font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B]` for red section labels

### Button pattern (the standard CTA button)
```tsx
<button className="group relative inline-flex items-center overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors">
  {/* Red fill slides in from left on hover */}
  <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        aria-hidden="true" />
  <span className="relative z-10">Button Label</span>
</button>
```

### Nav structure
- Fixed top nav, transparent until scrolled 60px then `bg-[#111111]/95 backdrop-blur-sm`
- Logo: "The Daily Mischief" (serif, light, tracked)
- Desktop links: Today's Mischief (with countdown), Wardrobe, Home, Oddities, Editorial, About, Account, Bag
- Mobile: hamburger → full-screen overlay

---

## 12. The `next.config.js`

```javascript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/s/files/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 31536000,
  },
}
module.exports = nextConfig
```

If you add product images from a new domain, add it to `remotePatterns` or Next.js Image will throw a 400 error.

---

## 13. Bugs Fixed (For Historical Context)

### Bug 1: MCP connected to wrong Shopify store
Claude's Shopify MCP connector was pointing to a different store (GRUNN). All products/collections created in sessions before this were in the wrong store and invisible on `thedailymischief.store`. Fixed by switching the MCP to `a5d5y4-ap.myshopify.com` and recreating everything.

### Bug 2: Duplicate GraphQL fragment definitions
Each fragment originally embedded its sub-fragments via `${...}` interpolation. When queries also included those fragments, they ended up defined 2–3× in the same string. Shopify rejects this with: `"ImageFragment was defined more than once"`. Fixed by making all fragments standalone (no embedding) and having each query declare its own fragment list exactly once.

### Bug 3: Unused fragment definition
`GET_COLLECTION_BY_HANDLE` was including `${PRODUCT_VARIANT_FRAGMENT}` but the query body used inline variant fields instead of `...ProductVariantFragment`. Shopify rejected with: `"Fragment ProductVariantFragment was defined, but not used"`. Fixed by removing `PRODUCT_VARIANT_FRAGMENT` from that query.

### Bug 4: Vercel Data Cache serving stale empty results
After publishing products to the Headless channel, the site still showed empty collections because Vercel's persistent Data Cache had cached the empty responses before the products were published. Redeploying does NOT clear this cache. Fixed by adding a `GET /api/revalidate` endpoint that calls `revalidateTag()`. Must be called manually after publishing new products.

### Bug 5: Next.js Image crashing on product pages
Product images used `images.unsplash.com` URLs but `next.config.js` only whitelisted `cdn.shopify.com`. Fixed by adding Unsplash to `remotePatterns`.

### Bug 6: `shopifyFetch` called with wrong signature
In `lib/shopify/customer.ts`, the initial code used object-style call `shopifyFetch({ query, variables, cache })` and then accessed `res.body.data`. The actual function takes positional args and returns `json.data` directly. Fixed to use: `shopifyFetch<T>(QUERY, variables, options)` and access `.fieldName` directly on the result.

### Bug 7: git index.lock errors
VS Code's git integration holds the lock file. Fix in PowerShell:
```powershell
Remove-Item "C:\Users\Asus\OneDrive\Desktop\daily-mischief-v1\.git\index.lock" -Force
```

---

## 14. Deployment Workflow

1. Make changes locally
2. `git add -A`
3. `git commit -m "your message"`
4. `git push` → Vercel auto-deploys
5. After any product/collection changes in Shopify: hit `GET https://thedailymischief.store/api/revalidate`

### Common PowerShell gotcha
PowerShell doesn't support `&&` to chain commands. Run them on separate lines:
```powershell
git add -A
git commit -m "message"
git push
```

---

## 15. Payments / Checkout

**Current state:** Checkout redirects to Shopify's hosted checkout via `cart.checkoutUrl`. This works out of the box.

**To enable Razorpay/UPI:**
1. Install the Razorpay app: `apps.shopify.com/razorpay`
2. Connect your Razorpay account (create one at `razorpay.com` if needed)
3. Go to Shopify Admin → Settings → Payments → Additional payment methods → Activate Razorpay
4. Customers will see a Razorpay payment sheet (UPI, cards, net banking, wallets) at checkout

No code changes are needed for Razorpay — it integrates at the Shopify checkout level.

---

## 16. What Still Needs Building

### High priority
- **Contact form backend** — currently simulated with `setTimeout`. Needs a real email API (Resend at `resend.com` is easiest — free tier, Next.js SDK available)
- **Razorpay activation** — 5-minute setup in Shopify admin (see section 15)
- **Real editorial articles** — `/editorial/[slug]` dynamic route doesn't exist yet; editorial links go to 404

### Medium priority
- `/sizing` — size guide page
- `/privacy` and `/terms` — legal pages
- `/hall-of-mischief` — community/UGC page
- `/graveyard` — archive of past 24-hour drops
- Customer address management in `/account`

### Low priority / Nice to have
- Email notifications for orders (handled by Shopify automatically once Razorpay is set up)
- Newsletter signup
- Countdown timer on product pages (not just in nav)
- Product reviews

---

## 17. MCP Connector Reference

The Shopify MCP connector (`14e1c90b-f48a-4720-a297-3559b85f349b`) provides Admin API access in Claude sessions. Key tools:

- `create-collection` — create a new collection
- `create-product` — create a product with variants and images
- `add-to-collection` — add products to a collection
- `graphql_mutation` — run any Admin API mutation (used for `publishablePublish`)
- `graphql_query` — run any Admin API query
- `get-shop-info` — verify which store is connected (always check this first in a new session)

**ALWAYS run `get-shop-info` at the start of a session to confirm you're connected to `a5d5y4-ap.myshopify.com`. The connector has accidentally pointed to a different store before.**

After creating any product or collection via MCP, you must also call `publishablePublish` to add it to the Headless channel publication (`gid://shopify/Publication/200378417410`), then call `/api/revalidate` to bust the ISR cache.

---

## 18. Quick Reference Cheatsheet

```
Store:          a5d5y4-ap.myshopify.com
Headless pub:   gid://shopify/Publication/200378417410
Storefront URL: https://a5d5y4-ap.myshopify.com/api/2024-10/graphql.json
Private token:  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
Repo path:      C:\Users\Asus\OneDrive\Desktop\daily-mischief-v1
Live site:      https://thedailymischief.store
Cache bust:     GET https://thedailymischief.store/api/revalidate
Debug endpoint: GET https://thedailymischief.store/api/debug
Git lock fix:   Remove-Item "...daily-mischief-v1\.git\index.lock" -Force
```
