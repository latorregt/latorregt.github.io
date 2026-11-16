'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'HAZ TUS PEDIDOS AL +502 5744 5909',
  'ENTREGA GRATUITA PARA PEDIDOS DE MÁS DE Q1250',
  'PAGOS POR DEPÓSITO O TRANSFERENCIA',
  'CON MÁS DE 30 AÑOS DE SERVICIO',
  'PRONTO MÁS DE LA COLECCIÓN DE FIN DE AÑO',
]

export function TopBar() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="bg-midnight text-cream py-2.5 overflow-hidden border-b border-gold/30" role="region" aria-label="Avisos">
      <div className="max-w-7xl mx-auto px-4 text-center relative h-5">
        <p key={idx} className="topbar-message text-[11px] md:text-xs tracking-[0.18em] uppercase font-medium absolute inset-0 flex items-center justify-center">
          {MESSAGES[idx]}
        </p>
      </div>
    </div>
  )
}
