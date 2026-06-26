import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#111111]">
      <div className="px-5 md:px-10 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-[22px] font-light tracking-[0.15em] uppercase text-white mb-4">
            The Daily<br />Mischief
          </p>
          <p className="font-sans text-[11px] leading-[1.8] text-white/35">
            One piece. Every day.<br />
            24 hours at its lowest price.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-5">Shop</p>
          <ul className="space-y-3">
            {[
              ['Today\'s Mischief', '/shop/collections/todays-mischief'],
              ['Wardrobe', '/shop/collections/wardrobe'],
              ['Home', '/shop/collections/home'],
              ['Oddities', '/shop/collections/oddities'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-sans text-[11px] text-white/40 hover:text-white transition-colors tracking-[0.04em]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand */}
        <div>
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-5">Mischief</p>
          <ul className="space-y-3">
            {[
              ['About', '/about'],
              ['Editorial', '/editorial'],
              ['The Regret Tax', '/regret-tax'],
              ['Hall of Mischief', '/hall-of-mischief'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-sans text-[11px] text-white/40 hover:text-white transition-colors tracking-[0.04em]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-5">Help</p>
          <ul className="space-y-3">
            {[
              ['Sizing', '/sizing'],
              ['Shipping', '/shipping'],
              ['Returns', '/returns'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-sans text-[11px] text-white/40 hover:text-white transition-colors tracking-[0.04em]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 md:px-10 py-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="font-sans text-[10px] tracking-[0.12em] text-white/20">
          © {new Date().getFullYear()} The Daily Mischief. All mischief reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="font-sans text-[10px] tracking-[0.12em] text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="/terms" className="font-sans text-[10px] tracking-[0.12em] text-white/20 hover:text-white/50 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
