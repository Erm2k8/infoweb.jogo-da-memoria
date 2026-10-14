import type { Carta } from './deck'

export type Modo = 'solo' | 'duo'
export type Jogador = 0 | 1

export const PONTOS_POR_PAR = 10

export interface Evento {
  tipo: 'acerto' | 'erro'
  jogador: Jogador
}

export interface Estado {
  modo: Modo
  cartas: Carta[]
  abertas: number[]
  vez: Jogador
  pontos: [number, number]
  jogadas: number
  ultimo: Evento | null
  inicio: number | null
  fim: number | null
  rodada: number
}

export type Acao =
  | { tipo: 'virar'; indice: number; agora: number }
  | { tipo: 'desvirar' }
  | { tipo: 'reiniciar'; cartas: Carta[] }

export function criarEstado(modo: Modo, cartas: Carta[], rodada = 0): Estado {
  return {
    modo,
    cartas,
    abertas: [],
    vez: 0,
    pontos: [0, 0],
    jogadas: 0,
    ultimo: null,
    inicio: null,
    fim: null,
    rodada,
  }
}

export const estaBloqueado = (estado: Estado) => estado.abertas.length === 2 || estado.fim !== null

export function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'virar': {
      const carta = estado.cartas[acao.indice]
      if (!carta || carta.virada || carta.encontrada || estaBloqueado(estado)) return estado

      const cartas = estado.cartas.map((c, i) => (i === acao.indice ? { ...c, virada: true } : c))
      const abertas = [...estado.abertas, acao.indice]
      const inicio = estado.inicio ?? acao.agora
      if (abertas.length < 2) return { ...estado, cartas, abertas, inicio }

      const [a, b] = abertas
      const jogadas = estado.jogadas + 1
      if (cartas[a].figurinha.id !== cartas[b].figurinha.id) {
        return { ...estado, cartas, abertas, inicio, jogadas, ultimo: { tipo: 'erro', jogador: estado.vez } }
      }

      const marcadas = cartas.map((c, i) => (i === a || i === b ? { ...c, encontrada: true, dono: estado.vez } : c))
      const pontos: [number, number] = [...estado.pontos]
      pontos[estado.vez] += PONTOS_POR_PAR
      return {
        ...estado,
        cartas: marcadas,
        abertas: [],
        inicio,
        jogadas,
        pontos,
        ultimo: { tipo: 'acerto', jogador: estado.vez },
        fim: marcadas.every((c) => c.encontrada) ? acao.agora : null,
      }
    }

    case 'desvirar': {
      if (estado.abertas.length !== 2) return estado
      const cartas = estado.cartas.map((c, i) => (estado.abertas.includes(i) ? { ...c, virada: false } : c))
      const vez: Jogador = estado.modo === 'duo' ? (estado.vez === 0 ? 1 : 0) : estado.vez
      return { ...estado, cartas, abertas: [], vez }
    }

    case 'reiniciar':
      return criarEstado(estado.modo, acao.cartas, estado.rodada + 1)
  }
}
