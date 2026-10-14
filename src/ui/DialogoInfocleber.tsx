import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { dino } from '../assets'
import { tocar } from '../audio/sons'
import { textos } from '../content/textos'
import { IconeFechar } from './icones'
import { TextoDigitado } from './TextoDigitado'
import { useDigitacao } from './useDigitacao'
import s from './DialogoInfocleber.module.css'

const { falas } = textos.regras

export function DialogoInfocleber({ onFechar }: { onFechar: () => void }) {
  const [indice, setIndice] = useState(0)
  const fala = falas[indice]
  const digitacao = useDigitacao(fala, { velocidade: 14, atraso: indice === 0 ? 150 : 0 })
  const painel = useRef<HTMLDivElement>(null)

  const avancar = () => {
    if (!digitacao.completo) return digitacao.completar()
    tocar('clique')
    if (indice === falas.length - 1) return onFechar()
    setIndice(indice + 1)
  }

  useEffect(() => {
    painel.current?.focus()
    const aoTeclar = (evento: KeyboardEvent) => evento.key === 'Escape' && onFechar()
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  return (
    <motion.div className={s.camada} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={s.fundo} onClick={onFechar} />
      <motion.div
        ref={painel}
        className={s.painel}
        role="dialog"
        aria-modal
        aria-labelledby="dialogo-nome"
        tabIndex={-1}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        onClick={avancar}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' || evento.key === ' ') {
            evento.preventDefault()
            avancar()
          }
        }}
      >
        <motion.img
          src={dino.grande}
          alt=""
          className={`${s.dino} pixelado`}
          initial={{ x: '110%' }}
          animate={{ x: 0, y: digitacao.completo ? 0 : [0, -6, 0] }}
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 24, delay: 0.05 },
            y: { duration: 0.3, repeat: digitacao.completo ? 0 : Infinity },
          }}
        />
        <div className={s.conteudo}>
          <h2 id="dialogo-nome" className={s.nome}>
            {textos.regras.nome}
          </h2>
          <p className={s.fala} aria-live="polite">
            <TextoDigitado texto={fala} {...digitacao} />
          </p>
          <div className={s.rodape}>
            <span className={s.progresso}>
              {falas.map((_, i) => (
                <span key={i} className={i <= indice ? s.pontoAtivo : s.ponto} />
              ))}
            </span>
            <AnimatePresence>
              {digitacao.completo && (
                <motion.span
                  className={s.continuar}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: [1, 0.35, 1], x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 1.4, repeat: Infinity }, x: { duration: 0.2 } }}
                >
                  {textos.regras.continuar} ▸
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <button
          type="button"
          className={s.fechar}
          aria-label={textos.regras.fechar}
          onClick={(evento) => {
            evento.stopPropagation()
            onFechar()
          }}
        >
          <IconeFechar />
        </button>
      </motion.div>
    </motion.div>
  )
}
