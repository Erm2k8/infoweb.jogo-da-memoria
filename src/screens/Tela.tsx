import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function Tela({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.14, ease: 'easeIn' } }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.main>
  )
}
