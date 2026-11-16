'use client'
import { Picture } from '@/components/boutique/picture'

interface LogoProps {
  onClick?: () => void
}

export function Logo({ onClick }: LogoProps) {
  return (
    <button onClick={onClick} className="group flex items-center" aria-label="Boutique La Torre — inicio">
      <Picture
        src="/images/marca/8D4C6831-32D5-433E-A140-3BC07B89F0C3-removebg-preview.png"
        alt="La Torre"
        className="h-16 w-16 md:h-20 md:w-20 object-contain max-h-[5rem] md:max-h-[6rem]"
        sizes="80px"
        widths={[200]}
        loading="eager"
      />
    </button>
  )
}
