'use client'

import { BRAND } from '@/lib/boutique/brand'
import { track } from '@/lib/boutique/analytics'

export function SocialIcons({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const color = variant === 'light' ? 'text-cream hover:text-gold' : 'text-midnight hover:text-gold'
  return (
    <div className="flex items-center gap-8">
      <a href={BRAND.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok de La Torre" className={`${color} transition-colors`} onClick={() => track('social_click', { network: 'tiktok' })}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
      </a>
      <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de La Torre" className={`${color} transition-colors`} onClick={() => track('social_click', { network: 'instagram' })}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
      </a>
      <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de La Torre" className={`${color} transition-colors`} onClick={() => track('social_click', { network: 'facebook' })}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
      </a>
    </div>
  )
}
