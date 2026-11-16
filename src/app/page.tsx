import { Suspense } from 'react'
import { BoutiqueClient } from '@/components/boutique/boutique-client'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <BoutiqueClient />
    </Suspense>
  )
}
