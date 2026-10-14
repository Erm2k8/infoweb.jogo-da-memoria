import { motion, type HTMLMotionProps, type TargetAndTransition } from 'motion/react'
import type { ReactNode } from 'react'
import { tocar } from '../audio/sons'
import s from './Botao.module.css'

type Props = HTMLMotionProps<'button'> & {
  cor: 'verde' | 'azul' | 'laranja' | 'amarelo'
  tamanho?: 'grande' | 'medio'
  icone?: ReactNode
  animacaoIcone?: TargetAndTransition
  children: ReactNode
}

export function Botao({ cor, tamanho = 'medio', icone, animacaoIcone, children, className, onClick, ...props }: Props) {
  return (
    <motion.button
      type="button"
      className={[s.botao, s[cor], s[tamanho], className].filter(Boolean).join(' ')}
      whileHover="hover"
      whileTap="tap"
      variants={{ hover: { y: -3 }, tap: { y: 1, scale: 0.96 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      onClick={(evento) => {
        tocar('clique')
        onClick?.(evento)
      }}
      {...props}
    >
      {icone && (
        <motion.span className={s.icone} variants={animacaoIcone && { hover: animacaoIcone }}>
          {icone}
        </motion.span>
      )}
      <span>{children}</span>
    </motion.button>
  )
}
