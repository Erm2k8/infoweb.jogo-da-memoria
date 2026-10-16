import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { reacoes } from '../assets'
import s from './ReacaoDino.module.css'

if (typeof window !== 'undefined') {
  for (const src of Object.values(reacoes)) if (src) new Image().src = src
}

export type Lado = 'esquerda' | 'direita'

export interface Reacao {
  id: number
  tipo: 'acerto' | 'erro' | 'vez'
}

type Props = {
  reacao: Reacao | null
  lado: Lado
  cor?: string
}

export function ReacaoDino({ reacao, lado, cor }: Props) {
  const src = reacao && reacoes[reacao.tipo]

  return (
    <AnimatePresence>
      {reacao && src && (
        <motion.div
          key={reacao.id}
          className={`${s.reacao} ${s[lado]}`}
          style={cor ? ({ '--cor': cor } as CSSProperties) : undefined}
          aria-hidden
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 24 }}
        >
          <img src={src} alt="" className="pixelado" draggable={false} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DURACAO_REACAO = 1400

export function useReacao() {
  const [reacao, setReacao] = useState<Reacao | null>(null)

  useEffect(() => {
    if (!reacao) return
    const timer = setTimeout(() => setReacao(null), DURACAO_REACAO)
    return () => clearTimeout(timer)
  }, [reacao])

  return [reacao, setReacao] as const
}
