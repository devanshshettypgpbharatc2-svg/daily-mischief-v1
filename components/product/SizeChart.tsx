'use client'

import { AccordionItem } from '@/components/ui/Accordion'
export { isClothingProduct } from '@/utils'

const SIZES = [
  { size: 'XS',  chest: '81–86',  waist: '61–66',  hip: '86–91',  shoulder: '38' },
  { size: 'S',   chest: '86–91',  waist: '66–71',  hip: '91–96',  shoulder: '40' },
  { size: 'M',   chest: '91–96',  waist: '71–76',  hip: '96–101', shoulder: '42' },
  { size: 'L',   chest: '96–101', waist: '76–81',  hip: '101–106',shoulder: '44' },
  { size: 'XL',  chest: '101–106',waist: '81–86',  hip: '106–111',shoulder: '46' },
  { size: '2XL', chest: '106–111',waist: '86–91',  hip: '111–116',shoulder: '48' },
  { size: '3XL', chest: '111–116',waist: '91–96',  hip: '116–121',shoulder: '50' },
]

export function SizeChart() {
  return (
    <AccordionItem label="Size Chart">
      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[360px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {['Size', 'Chest', 'Waist', 'Hip', 'Shoulder'].map(h => (
                <th
                  key={h}
                  className="pb-3 font-sans text-[8px] tracking-[0.3em] uppercase text-white/28 text-left font-normal pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((row, i) => (
              <tr
                key={row.size}
                className={`border-b border-white/[0.05] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
              >
                <td className="py-2.5 font-sans text-[10px] tracking-[0.15em] text-white/70 pr-4">
                  {row.size}
                </td>
                <td className="py-2.5 font-sans text-[10px] text-white/38 pr-4">{row.chest}</td>
                <td className="py-2.5 font-sans text-[10px] text-white/38 pr-4">{row.waist}</td>
                <td className="py-2.5 font-sans text-[10px] text-white/38 pr-4">{row.hip}</td>
                <td className="py-2.5 font-sans text-[10px] text-white/38">{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-sans text-[9px] text-white/22 leading-[1.7] mt-4">
          All measurements in cm. Between sizes? Size up.
        </p>
      </div>
    </AccordionItem>
  )
}
