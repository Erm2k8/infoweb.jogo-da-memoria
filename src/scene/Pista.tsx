import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { imagens } from '../assets'
import s from './Pista.module.css'

export const VELOCIDADE_PISTA = 500

const ANTECEDENCIA_PULO = 0.12

interface Obstaculo {
  id: number
  cactos: number
  altura: number
}

type Props = {
  dino: RefObject<HTMLElement | null>
  onPular: () => void
}

export function Pista({ dino, onPular }: Props) {
  const reduzir = useReducedMotion()
  const [obstaculos, setObstaculos] = useState<Obstaculo[]>([])
  const pista = useRef<HTMLDivElement>(null)
  const elementos = useRef(new Map<number, HTMLElement>())
  const posicoes = useRef(new Map<number, { x: number; pulou: boolean }>())
  const pular = useRef(onPular)
  pular.current = onPular

  useEffect(() => {
    if (reduzir) return
    let quadro = 0
    let anterior = performance.now()
    let proximo = 1.5
    let id = 0

    const passo = (agora: number) => {
      const dt = Math.min((agora - anterior) / 1000, 0.05)
      anterior = agora
      const caixa = pista.current?.getBoundingClientRect()
      const corpo = dino.current?.getBoundingClientRect()

      if (caixa && corpo) {
        proximo -= dt
        if (proximo <= 0) {
          proximo = 1.1 + Math.random() * 1.4
          const novo = { id: id++, cactos: Math.random() < 0.3 ? 2 : 1, altura: corpo.width * 0.42 }
          posicoes.current.set(novo.id, { x: caixa.width, pulou: false })
          setObstaculos((lista) => [...lista, novo])
        }

        const frenteDino = corpo.right - caixa.left
        const sairam: number[] = []
        for (const [chave, posicao] of posicoes.current) {
          posicao.x -= VELOCIDADE_PISTA * dt
          const elemento = elementos.current.get(chave)
          if (elemento) elemento.style.transform = `translateX(${posicao.x}px)`
          if (!posicao.pulou && posicao.x - frenteDino < VELOCIDADE_PISTA * ANTECEDENCIA_PULO) {
            posicao.pulou = true
            pular.current()
          }
          if (posicao.x < -corpo.width) sairam.push(chave)
        }
        if (sairam.length) {
          for (const chave of sairam) posicoes.current.delete(chave)
          setObstaculos((lista) => lista.filter((o) => !sairam.includes(o.id)))
        }
      }
      quadro = requestAnimationFrame(passo)
    }

    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [dino, reduzir])

  if (reduzir) return null

  return (
    <div ref={pista} className={s.pista} aria-hidden>
      {obstaculos.map((obstaculo) => (
        <div
          key={obstaculo.id}
          ref={(elemento) => {
            if (!elemento) return
            elementos.current.set(obstaculo.id, elemento)
            elemento.style.transform = `translateX(${posicoes.current.get(obstaculo.id)?.x ?? 0}px)`
            return () => {
              elementos.current.delete(obstaculo.id)
            }
          }}
          className={s.obstaculo}
          style={{ height: obstaculo.altura }}
        >
          {Array.from({ length: obstaculo.cactos }, (_, i) => (
            <img key={i} src={imagens.cactoPequeno} alt="" draggable={false} />
          ))}
        </div>
      ))}
    </div>
  )
}
