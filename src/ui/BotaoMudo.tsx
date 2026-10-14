import { AnimatePresence, motion } from 'motion/react'
import { alternarMudo, useMudo } from '../audio/sons'
import { textos } from '../content/textos'
import { BotaoIcone } from './BotaoIcone'
import { IconeMudo, IconeSom } from './icones'
import s from './BotaoMudo.module.css'

export function BotaoMudo({ fixo = false }: { fixo?: boolean }) {
  const mudo = useMudo()

  return (
    <BotaoIcone
      className={fixo ? s.fixo : undefined}
      onClick={alternarMudo}
      aria-label={mudo ? textos.mudo.desativar : textos.mudo.ativar}
      aria-pressed={mudo}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mudo ? 'mudo' : 'som'}
          className={s.icone}
          initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
          transition={{ duration: 0.12 }}
        >
          {mudo ? <IconeMudo /> : <IconeSom />}
        </motion.span>
      </AnimatePresence>
    </BotaoIcone>
  )
}
