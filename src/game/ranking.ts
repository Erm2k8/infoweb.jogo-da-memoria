import { ler, salvar } from '../armazenamento'
import type { Dificuldade } from './dificuldades'
import type { Jogador } from './reducer'

export const LIMITE_SOLO = 10
const LIMITE_DUELOS = 50

export interface ResultadoSolo {
  id: number
  nome: string
  jogadas: number
  segundos: number
}

export interface Duelista {
  nome: string
  vitorias: number
  partidas: number
}

export interface Ranking {
  solo: Record<Dificuldade, ResultadoSolo[]>
  duelos: Duelista[]
}

const compararSolo = (a: ResultadoSolo, b: ResultadoSolo) =>
  a.jogadas - b.jogadas || a.segundos - b.segundos || a.id - b.id

const compararDuelos = (a: Duelista, b: Duelista) =>
  b.vitorias - a.vitorias || a.partidas - b.partidas || a.nome.localeCompare(b.nome)

const chave = (nome: string) => nome.trim().toLocaleLowerCase('pt-BR')

export function inserirSolo(ranking: Ranking, dificuldade: Dificuldade, resultado: ResultadoSolo) {
  const lista = [...ranking.solo[dificuldade], resultado].sort(compararSolo).slice(0, LIMITE_SOLO)
  const posicao = lista.indexOf(resultado) + 1
  return { ranking: { ...ranking, solo: { ...ranking.solo, [dificuldade]: lista } }, posicao: posicao || null }
}

export function inserirDuelo(ranking: Ranking, nomes: readonly [string, string], vencedor: Jogador | null): Ranking {
  const duelos = [...ranking.duelos]
  nomes.forEach((nome, i) => {
    const indice = duelos.findIndex((d) => chave(d.nome) === chave(nome))
    const atual = indice === -1 ? { nome, vitorias: 0, partidas: 0 } : duelos[indice]
    const novo = { nome, vitorias: atual.vitorias + (vencedor === i ? 1 : 0), partidas: atual.partidas + 1 }
    if (indice === -1) duelos.push(novo)
    else duelos[indice] = novo
  })
  return { ...ranking, duelos: duelos.sort(compararDuelos).slice(0, LIMITE_DUELOS) }
}

function lerRanking(): Ranking {
  const salvo = ler<{ solo?: ResultadoSolo[] | Partial<Ranking['solo']>; duelos?: Duelista[] }>('ranking', {})
  // Versões sem dificuldade guardavam só a lista do tabuleiro de 16 pares.
  const solo = Array.isArray(salvo.solo) ? { dificil: salvo.solo } : salvo.solo
  return { solo: { facil: [], medio: [], dificil: [], ...solo }, duelos: salvo.duelos ?? [] }
}

export async function buscarRanking(): Promise<Ranking> {
  return lerRanking()
}

export async function registrarSolo(dificuldade: Dificuldade, resultado: Omit<ResultadoSolo, 'id'>) {
  const novo = { ...resultado, id: Date.now() }
  const { ranking, posicao } = inserirSolo(lerRanking(), dificuldade, novo)
  salvar('ranking', ranking)
  return { id: novo.id, posicao }
}

export async function registrarDuelo(nomes: readonly [string, string], vencedor: Jogador | null) {
  salvar('ranking', inserirDuelo(lerRanking(), nomes, vencedor))
}
