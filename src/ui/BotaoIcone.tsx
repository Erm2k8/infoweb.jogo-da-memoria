import { motion, type HTMLMotionProps } from 'motion/react'
import s from './BotaoIcone.module.css'

export function BotaoIcone({ className, ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      type="button"
      className={[s.botao, className].filter(Boolean).join(' ')}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    />
  )
}
