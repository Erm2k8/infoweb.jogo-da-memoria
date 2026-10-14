import { describe, expect, it } from 'vitest'
import { LIMITE_SOLO, inserirDuelo, inserirSolo, type Ranking } from './ranking'

const vazio: Ranking = { solo: { facil: [], medio: [], dificil: [] }, duelos: [] }

describe('ranking solo', () => {
  it('ordena por jogadas e desempata pelo tempo', () => {
    let ranking = vazio
    ranking = inserirSolo(ranking, 'dificil', { id: 1, nome: 'Ana', jogadas: 20, segundos: 60 }).ranking
    ranking = inserirSolo(ranking, 'dificil', { id: 2, nome: 'Bia', jogadas: 18, segundos: 90 }).ranking
    const { ranking: final, posicao } = inserirSolo(ranking, 'dificil', { id: 3, nome: 'Caio', jogadas: 20, segundos: 40 })

    expect(final.solo.dificil.map((r) => r.nome)).toEqual(['Bia', 'Caio', 'Ana'])
    expect(posicao).toBe(2)
  })

  it('mantém só os melhores e indica quando o resultado ficou de fora', () => {
    let ranking = vazio
    for (let i = 0; i < LIMITE_SOLO; i++) {
      ranking = inserirSolo(ranking, 'medio', { id: i, nome: `J${i}`, jogadas: 10 + i, segundos: 30 }).ranking
    }
    const { ranking: final, posicao } = inserirSolo(ranking, 'medio', { id: 99, nome: 'Lento', jogadas: 80, segundos: 300 })

    expect(final.solo.medio).toHaveLength(LIMITE_SOLO)
    expect(posicao).toBeNull()
  })

  it('separa o ranking de cada dificuldade', () => {
    const { ranking, posicao } = inserirSolo(vazio, 'facil', { id: 1, nome: 'Ana', jogadas: 8, segundos: 20 })
    expect(posicao).toBe(1)
    expect(ranking.solo.facil).toHaveLength(1)
    expect(ranking.solo.dificil).toHaveLength(0)
  })
})

describe('ranking de duelos', () => {
  it('soma vitórias e partidas sem diferenciar maiúsculas', () => {
    let ranking = inserirDuelo(vazio, ['Ana', 'Bia'], 0)
    ranking = inserirDuelo(ranking, ['bia', 'ANA'], 0)
    ranking = inserirDuelo(ranking, ['Ana', 'Bia'], null)

    expect(ranking.duelos).toEqual([
      { nome: 'Ana', vitorias: 1, partidas: 3 },
      { nome: 'Bia', vitorias: 1, partidas: 3 },
    ])
  })

  it('coloca quem tem mais vitórias primeiro', () => {
    let ranking = inserirDuelo(vazio, ['Ana', 'Bia'], 1)
    ranking = inserirDuelo(ranking, ['Ana', 'Bia'], 1)

    expect(ranking.duelos[0]).toEqual({ nome: 'Bia', vitorias: 2, partidas: 2 })
  })
})
