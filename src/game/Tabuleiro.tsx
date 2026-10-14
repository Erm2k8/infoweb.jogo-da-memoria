import { motion } from 'motion/react'
import { useMemo, type CSSProperties, type KeyboardEvent } from 'react'
import { Carta, type Posicao } from './Carta'
import type { Carta as TipoCarta } from './deck'
import { CORES_JOGADOR } from './jogadores'
import s from './Tabuleiro.module.css'

type Props = {
  cartas: TipoCarta[]
  abertas: number[]
  bloqueado: boolean
  colunas: number
  corVez?: string
  onVirar: (indice: number) => void
}

const ESPACAMENTO = 1.12

const donos = CORES_JOGADOR.map((cor, i) => ({ cor, numero: i + 1 }))

const deslocamento: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

export function Tabuleiro({ cartas, abertas, bloqueado, colunas, corVez, onVirar }: Props) {
  const linhas = Math.ceil(cartas.length / colunas)

  const posicoes = useMemo<Posicao[]>(
    () =>
      cartas.map((_, i) => ({
        dx: ((colunas - 1) / 2 - (i % colunas)) * ESPACAMENTO,
        dy: ((linhas - 1) / 2 - Math.floor(i / colunas)) * ESPACAMENTO,
        ordem: i,
      })),
    [cartas.length, colunas, linhas],
  )

  const navegar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = deslocamento[evento.key]
    const atual = Number((evento.target as HTMLElement).dataset.indice)
    if (!passo || Number.isNaN(atual)) return
    const coluna = (atual % colunas) + passo[0]
    const linha = Math.floor(atual / colunas) + passo[1]
    if (coluna < 0 || coluna >= colunas || linha < 0 || linha >= linhas) return
    evento.preventDefault()
    evento.currentTarget.querySelector<HTMLElement>(`[data-indice="${linha * colunas + coluna}"]`)?.focus()
  }

  return (
    <motion.div
      className={s.grade}
      style={{ '--colunas': colunas, '--linhas': linhas, '--cor-vez': corVez } as CSSProperties}
      initial="oculto"
      animate="visivel"
      exit="saida"
      onKeyDown={navegar}
    >
      {cartas.map((carta, i) => (
        <Carta
          key={carta.id}
          carta={carta}
          indice={i}
          posicao={posicoes[i]}
          errou={abertas.length === 2 && abertas.includes(i)}
          bloqueado={bloqueado}
          dono={corVez !== undefined && carta.dono !== null ? donos[carta.dono] : undefined}
          onVirar={onVirar}
        />
      ))}
    </motion.div>
  )
}
