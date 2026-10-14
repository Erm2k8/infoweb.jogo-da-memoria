import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { textos } from '../content/textos'
import s from './Placar.module.css'

type Props = {
  rotulo: string
  icone: ReactNode
  cor?: string
  destaque?: ReactNode
  lado?: 'esquerda' | 'direita'
  vez?: boolean
  pulso?: number
  children: ReactNode
}

export function Placar({ rotulo, icone, cor, destaque, lado = 'esquerda', vez, pulso = 0, children }: Props) {
  const classes = [s.placar, lado === 'direita' && s.direita, cor && s.jogador, vez === true && s.ativo, vez === false && s.espera]

  return (
    <motion.div
      className={classes.filter(Boolean).join(' ')}
      style={cor ? ({ '--cor': cor } as CSSProperties) : undefined}
      initial={{ opacity: 0, x: lado === 'direita' ? 30 : -30 }}
      animate={{ opacity: vez === false ? 0.55 : 1, x: 0, scale: vez === true ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <motion.span
        key={pulso}
        className={s.icone}
        initial={pulso ? { scale: 0.4, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      >
        {icone}
      </motion.span>
      <span className={s.textos}>
        <span className={s.rotulo}>{rotulo}</span>
        <span className={s.valor}>{children}</span>
        {destaque && <span className={s.destaque}>{destaque}</span>}
      </span>
      {vez && (
        <motion.span layoutId="sua-vez" className={s.suaVez} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {textos.jogo.suaVez}
          </motion.span>
        </motion.span>
      )}
    </motion.div>
  )
}

export function Contador({ valor }: { valor: number }) {
  const atual = useMotionValue(valor)
  const arredondado = useTransform(atual, (v) => Math.round(v))

  useEffect(() => {
    const controle = animate(atual, valor, { duration: 0.4, ease: 'easeOut' })
    return () => controle.stop()
  }, [atual, valor])

  return <motion.span>{arredondado}</motion.span>
}
