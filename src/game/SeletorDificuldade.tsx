import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { textos } from '../content/textos'
import { NIVEIS, ORDEM_NIVEIS, RECOMENDADA, type Dificuldade } from './dificuldades'
import s from './SeletorDificuldade.module.css'

type Props = {
  valor: Dificuldade
  onChange: (dificuldade: Dificuldade) => void
  grupo: string
  compacto?: boolean
}

const t = textos.dificuldades

export function SeletorDificuldade({ valor, onChange, grupo, compacto = false }: Props) {
  return (
    <div className={`${s.seletor} ${compacto ? s.compacto : ''}`} role="radiogroup" aria-label={t.titulo}>
      {ORDEM_NIVEIS.map((nivel) => {
        const { pares, colunas } = NIVEIS[nivel]
        const selecionado = nivel === valor
        return (
          <motion.button
            key={nivel}
            type="button"
            role="radio"
            aria-checked={selecionado}
            className={s.opcao}
            onClick={() => onChange(nivel)}
            whileTap={{ scale: 0.96 }}
          >
            {selecionado && (
              <motion.span
                layoutId={`nivel-${grupo}`}
                className={s.marcador}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            {!compacto && (
              <span
                className={s.previa}
                style={{ '--colunas': colunas } as CSSProperties}
                aria-hidden
              >
                {Array.from({ length: pares * 2 }, (_, i) => (
                  <span key={i} />
                ))}
              </span>
            )}
            <span className={s.nome}>{t[nivel]}</span>
            {!compacto && <span className={s.pares}>{t.pares(pares)}</span>}
            {!compacto && nivel === RECOMENDADA && <span className={s.selo}>{t.recomendado}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}
