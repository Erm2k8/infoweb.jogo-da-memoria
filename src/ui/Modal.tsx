import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { textos } from '../content/textos'
import { IconeFechar } from './icones'
import s from './Modal.module.css'

type Props = {
  titulo: string
  onFechar?: () => void
  children: ReactNode
}

export function Modal({ titulo, onFechar, children }: Props) {
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    painel.current?.querySelector<HTMLElement>('button:not([data-fechar])')?.focus()
    if (!onFechar) return
    const aoTeclar = (evento: KeyboardEvent) => evento.key === 'Escape' && onFechar()
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  return (
    <motion.div
      className={s.fundo}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onFechar}
    >
      <motion.div
        ref={painel}
        className={s.painel}
        role="dialog"
        aria-modal
        aria-labelledby="modal-titulo"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={(evento) => evento.stopPropagation()}
      >
        {onFechar && (
          <button type="button" className={s.fechar} onClick={onFechar} aria-label={textos.modos.fechar} data-fechar>
            <IconeFechar />
          </button>
        )}
        <h2 id="modal-titulo" className={s.titulo}>
          {titulo}
        </h2>
        {children}
      </motion.div>
    </motion.div>
  )
}
