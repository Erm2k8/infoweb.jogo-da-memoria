import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { figurinhas } from '../assets'
import { tocar } from '../audio/sons'
import { textos } from '../content/textos'
import { criarCartas, escolherFigurinhas } from './deck'
import { NIVEIS, type Dificuldade } from './dificuldades'
import type { Nomes } from './jogadores'
import { buscarRanking, registrarDuelo, registrarSolo, type ResultadoSolo } from './ranking'
import { criarEstado, estaBloqueado, reducer, type Estado, type Jogador, type Modo } from './reducer'

const ATRASO_DESVIRAR = 650

export interface Classificacao {
  id: number
  posicao: number | null
}

const novasCartas = (dificuldade: Dificuldade) =>
  criarCartas(escolherFigurinhas(figurinhas, NIVEIS[dificuldade].pares, textos.jogo.figurinha))

export function vencedor({ pontos: [a, b] }: Estado): Jogador | null {
  return a === b ? null : a > b ? 0 : 1
}

export function useGame(modo: Modo, nomes: Nomes, dificuldade: Dificuldade) {
  const [estado, dispatch] = useReducer(reducer, modo, (m) => criarEstado(m, novasCartas(dificuldade)))
  const [agora, setAgora] = useState(() => Date.now())
  const [recorde, setRecorde] = useState<ResultadoSolo | null>(null)
  const [classificacao, setClassificacao] = useState<Classificacao | null>(null)
  const anterior = useRef(estado)
  const atual = useRef(estado)
  atual.current = estado

  const rodando = estado.inicio !== null && estado.fim === null
  const segundos = estado.inicio === null ? 0 : Math.floor(((estado.fim ?? agora) - estado.inicio) / 1000)

  const atualizarRecorde = useCallback(() => {
    buscarRanking().then(
      (ranking) => setRecorde(ranking.solo[dificuldade][0] ?? null),
      () => {},
    )
  }, [dificuldade])

  useEffect(atualizarRecorde, [atualizarRecorde])

  useEffect(() => {
    if (estado.abertas.length !== 2) return
    const timer = setTimeout(() => dispatch({ tipo: 'desvirar' }), ATRASO_DESVIRAR)
    return () => clearTimeout(timer)
  }, [estado.abertas])

  useEffect(() => {
    if (!rodando) return
    const timer = setInterval(() => setAgora(Date.now()), 250)
    return () => clearInterval(timer)
  }, [rodando])

  useEffect(() => {
    const antes = anterior.current
    anterior.current = estado
    if (estado.jogadas === antes.jogadas || estado.rodada !== antes.rodada) return

    if (estado.fim === null || estado.inicio === null) {
      tocar(estado.ultimo?.tipo === 'acerto' ? 'acerto' : 'erro')
      return
    }

    tocar('vitoria')
    if (estado.modo === 'duo') {
      registrarDuelo(nomes, vencedor(estado)).catch(() => {})
      return
    }
    const tempo = Math.floor((estado.fim - estado.inicio) / 1000)
    const { rodada } = estado
    // Sem conexão a partida termina normalmente, só sem a posição no ranking.
    registrarSolo(dificuldade, { nome: nomes[0], jogadas: estado.jogadas, segundos: tempo })
      .then((resultado) => {
        if (atual.current.rodada === rodada) setClassificacao(resultado)
      })
      .catch(() => {})
      .finally(atualizarRecorde)
  }, [estado, nomes, dificuldade, atualizarRecorde])

  const virar = useCallback((indice: number) => {
    const carta = atual.current.cartas[indice]
    if (!carta || carta.virada || carta.encontrada || estaBloqueado(atual.current)) return
    tocar('virar')
    dispatch({ tipo: 'virar', indice, agora: Date.now() })
  }, [])

  const reiniciar = useCallback(() => {
    setClassificacao(null)
    setAgora(Date.now())
    dispatch({ tipo: 'reiniciar', cartas: novasCartas(dificuldade) })
  }, [dificuldade])

  return { estado, virar, reiniciar, segundos, recorde, classificacao }
}

export function formatarTempo(segundos: number) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
