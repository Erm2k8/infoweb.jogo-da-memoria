import { ler, salvar } from '../armazenamento'

export type Dificuldade = 'facil' | 'medio' | 'dificil'

interface Nivel {
  pares: number
  colunas: number
  colunasRetrato: number
}

export const NIVEIS: Record<Dificuldade, Nivel> = {
  facil: { pares: 6, colunas: 4, colunasRetrato: 3 },
  medio: { pares: 10, colunas: 5, colunasRetrato: 4 },
  dificil: { pares: 16, colunas: 8, colunasRetrato: 4 },
}

export const ORDEM_NIVEIS = Object.keys(NIVEIS) as Dificuldade[]

export const RECOMENDADA: Dificuldade = 'dificil'

export function lerDificuldade(): Dificuldade {
  const salva = ler<string>('dificuldade', RECOMENDADA)
  return salva in NIVEIS ? (salva as Dificuldade) : RECOMENDADA
}

export const salvarDificuldade = (dificuldade: Dificuldade) => salvar('dificuldade', dificuldade)
