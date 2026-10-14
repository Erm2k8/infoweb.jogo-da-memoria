import { motion, type Variants } from 'motion/react'
import { memo, type CSSProperties } from 'react'
import { imagens } from '../assets'
import { textos } from '../content/textos'
import type { Carta as TipoCarta, Figurinha } from './deck'
import s from './Carta.module.css'

export interface Posicao {
  dx: number
  dy: number
  ordem: number
}

const distribuicao: Variants = {
  oculto: ({ dx, dy, ordem }: Posicao) => ({
    x: `${dx * 100}%`,
    y: `${dy * 100}%`,
    scale: 0.6,
    rotate: ((ordem * 37) % 13) - 6,
  }),
  visivel: ({ ordem }: Posicao) => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 420, damping: 30, delay: 0.05 + ordem * 0.012 },
  }),
  saida: ({ dx, dy, ordem }: Posicao) => ({
    x: `${dx * 100}%`,
    y: `${dy * 100}%`,
    scale: 0.6,
    rotate: ((ordem * 37) % 13) - 6,
    transition: { duration: 0.22, ease: 'easeIn', delay: ordem * 0.004 },
  }),
}

const coresPadrao = ['#facc15', '#eb4925', '#7436dd', '#2563eb', '#658b61', '#d66d64', '#c6a170', '#15182e']

const particulas = Array.from({ length: 10 }, (_, i) => {
  const angulo = (i / 10) * Math.PI * 2
  const distancia = 70 + (i % 3) * 18
  return { x: Math.cos(angulo) * distancia, y: Math.sin(angulo) * distancia, cor: coresPadrao[i % 5] }
})

type Props = {
  carta: TipoCarta
  indice: number
  posicao: Posicao
  errou: boolean
  bloqueado: boolean
  dono?: { cor: string; numero: number }
  onVirar: (indice: number) => void
}

export const Carta = memo(function Carta({ carta, indice, posicao, errou, bloqueado, dono, onVirar }: Props) {
  const { figurinha, virada, encontrada } = carta
  const revelada = virada || encontrada
  const podeVirar = !revelada && !bloqueado
  const estado = encontrada ? s.encontrada : errou ? s.errada : virada ? s.aberta : ''

  return (
    <motion.div className={s.slot} custom={posicao} variants={distribuicao}>
      <motion.button
        type="button"
        className={`${s.carta} ${estado}`}
        style={dono && ({ '--dono': dono.cor } as CSSProperties)}
        data-indice={indice}
        aria-label={revelada ? figurinha.nome : textos.jogo.cartaVirada(indice + 1)}
        aria-disabled={!podeVirar}
        onClick={() => onVirar(indice)}
        whileHover={podeVirar ? { y: -6, rotate: indice % 2 ? 1.5 : -1.5 } : { y: 0, rotate: 0 }}
        whileTap={podeVirar ? { scale: 0.94 } : {}}
        animate={
          errou
            ? { x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.35, delay: 0.15 } }
            : encontrada
              ? { scale: [1, 1.1, 1], transition: { duration: 0.35, delay: 0.12 } }
              : { x: 0, scale: 1 }
        }
      >
        <motion.span
          className={s.miolo}
          initial={false}
          animate={{ rotateY: revelada ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 480, damping: 32 }}
        >
          <span className={s.verso}>
            <img src={imagens.versoCarta} alt="" draggable={false} />
          </span>
          <span className={s.frente}>
            <Face figurinha={figurinha} />
            {dono && <span className={s.selo}>{dono.numero}</span>}
          </span>
        </motion.span>
        {encontrada && (
          <span className={s.particulas} aria-hidden>
            {particulas.map((p, i) => (
              <motion.span
                key={i}
                style={{ background: dono?.cor ?? p.cor }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: p.x, y: p.y, scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
              />
            ))}
          </span>
        )}
      </motion.button>
    </motion.div>
  )
})

function Face({ figurinha }: { figurinha: Figurinha }) {
  if (figurinha.src) return <img src={figurinha.src} alt="" draggable={false} />
  const cor = coresPadrao[(figurinha.numero - 1) % coresPadrao.length]
  const invertida = figurinha.numero > coresPadrao.length
  return (
    <span
      className={invertida ? `${s.padrao} ${s.invertida}` : s.padrao}
      style={invertida ? { color: cor, borderColor: cor } : { background: cor }}
    >
      {figurinha.numero}
    </span>
  )
}
