import { ler, salvar } from '../armazenamento'
import { chamar, consultar, supabaseConfigurado } from '../supabase'
import { ORDEM_NIVEIS, type Dificuldade } from './dificuldades'
import type { Jogador } from './reducer'

export const LIMITE_SOLO = 10
const LIMITE_DUELOS = 50
const LIMITE_DUELOS_ONLINE = 10

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

// Com o Supabase configurado (veja o README), o ranking é global; sem ele, fica no localStorage.
export async function buscarRanking(): Promise<Ranking> {
  if (!supabaseConfigurado) return lerRanking()
  const [solo, duelos] = await Promise.all([
    Promise.all(
      ORDEM_NIVEIS.map((nivel) =>
        consultar<ResultadoSolo[]>(
          `resultados_solo?select=id,nome,jogadas,segundos&dificuldade=eq.${nivel}` +
            `&order=jogadas.asc,segundos.asc,id.asc&limit=${LIMITE_SOLO}`,
        ),
      ),
    ),
    consultar<Duelista[]>(
      `duelistas?select=nome,vitorias,partidas&order=vitorias.desc,partidas.asc,nome.asc&limit=${LIMITE_DUELOS_ONLINE}`,
    ),
  ])
  return { solo: Object.fromEntries(ORDEM_NIVEIS.map((nivel, i) => [nivel, solo[i]])) as Ranking['solo'], duelos }
}

export async function registrarSolo(
  dificuldade: Dificuldade,
  resultado: Omit<ResultadoSolo, 'id'>,
): Promise<{ id: number; posicao: number | null }> {
  if (supabaseConfigurado) {
    return chamar('registrar_solo', {
      p_nome: resultado.nome,
      p_dificuldade: dificuldade,
      p_jogadas: resultado.jogadas,
      p_segundos: resultado.segundos,
    })
  }
  const novo = { ...resultado, id: Date.now() }
  const { ranking, posicao } = inserirSolo(lerRanking(), dificuldade, novo)
  salvar('ranking', ranking)
  return { id: novo.id, posicao }
}

export async function registrarDuelo(nomes: readonly [string, string], vencedor: Jogador | null) {
  if (supabaseConfigurado) return chamar<void>('registrar_duelo', { p_nomes: nomes, p_vencedor: vencedor })
  salvar('ranking', inserirDuelo(lerRanking(), nomes, vencedor))
}
