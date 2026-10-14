import { motion } from 'motion/react'
import { TextoDigitado } from './TextoDigitado'
import { useDigitacao } from './useDigitacao'
import s from './Balao.module.css'

type Props = {
  texto: string
  rabicho?: boolean
  atraso?: number
  className?: string
}

export function Balao({ texto, rabicho, atraso = 0, className }: Props) {
  const digitacao = useDigitacao(texto, { atraso })

  return (
    <motion.div
      className={[s.balao, className].filter(Boolean).join(' ')}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 24, delay: atraso / 1000 }}
    >
      <p className={s.texto}>
        <TextoDigitado texto={texto} {...digitacao} />
      </p>
      {rabicho && (
        <svg className={s.rabicho} viewBox="0 0 40 34" aria-hidden>
          <path d="M4 0 L0 32 L34 0" />
        </svg>
      )}
    </motion.div>
  )
}
