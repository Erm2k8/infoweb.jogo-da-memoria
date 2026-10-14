import { ler, salvar } from '../armazenamento'
import { textos } from '../content/textos'

export type Nomes = [string, string]

export const CORES_JOGADOR = ['var(--p1)', 'var(--p2)'] as const

export const LIMITE_NOME = 16

export const lerNomes = () => ler<Nomes>('nomes', ['', ''])

export function normalizarNomes(nomes: readonly string[]): Nomes {
  const limpos = nomes.map((nome, i) => nome.trim().slice(0, LIMITE_NOME) || textos.jogo.jogador(i + 1))
  return [limpos[0], limpos[1] ?? textos.jogo.jogador(2)]
}

export function salvarNomes(nomes: readonly string[]) {
  const atuais = lerNomes()
  salvar('nomes', atuais.map((nome, i) => nomes[i]?.trim() ?? nome))
}
