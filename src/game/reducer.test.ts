import { describe, expect, it } from 'vitest'
import { criarCartas, escolherFigurinhas, type Carta } from './deck'
import { NIVEIS } from './dificuldades'
import { PONTOS_POR_PAR, criarEstado, estaBloqueado, reducer, type Estado, type Modo } from './reducer'

const PARES = NIVEIS.dificil.pares

function semente(valor: number) {
  return () => (valor = (valor * 16807) % 2147483647) / 2147483647
}

function novoJogo(modo: Modo = 'duo'): Estado {
  const figurinhas = escolherFigurinhas([], PARES, (n) => `Figurinha ${n}`, semente(1))
  return criarEstado(modo, criarCartas(figurinhas, semente(2)))
}

function indicesDoPar(cartas: Carta[], id: string) {
  return cartas.flatMap((c, i) => (c.figurinha.id === id ? [i] : []))
}

function parErrado(cartas: Carta[]) {
  const outra = cartas.findIndex((c) => c.figurinha.id !== cartas[0].figurinha.id)
  return [0, outra] as const
}

const virar = (estado: Estado, indice: number, agora = 1000) => reducer(estado, { tipo: 'virar', indice, agora })

describe('deck', () => {
  it.each(Object.values(NIVEIS))('monta $pares pares completando com figurinhas padrão', ({ pares }) => {
    const imagens = ['ana-1.png', 'ana-2.png'] as const
    const figurinhas = escolherFigurinhas([{ id: 'ana', nome: 'Ana', imagens }], pares, (n) => `Figurinha ${n}`)
    expect(figurinhas).toHaveLength(pares)
    expect(figurinhas.filter((f) => f.imagens)).toHaveLength(1)

    const cartas = criarCartas(figurinhas)
    expect(cartas).toHaveLength(pares * 2)
    for (const f of figurinhas) {
      const par = indicesDoPar(cartas, f.id)
      expect(par.map((i) => cartas[i].lado).sort()).toEqual([0, 1])
    }
  })
})

describe('reducer', () => {
  it('vira uma carta e inicia o cronômetro', () => {
    const estado = virar(novoJogo(), 0, 500)
    expect(estado.cartas[0].virada).toBe(true)
    expect(estado.abertas).toEqual([0])
    expect(estado.inicio).toBe(500)
  })

  it('ignora carta já virada', () => {
    const estado = virar(novoJogo(), 0)
    expect(virar(estado, 0)).toBe(estado)
  })

  it('marca o par certo, pontua e mantém a vez', () => {
    let estado = novoJogo()
    const [a, b] = indicesDoPar(estado.cartas, estado.cartas[0].figurinha.id)
    estado = virar(virar(estado, a), b)

    expect(estado.cartas[a].encontrada && estado.cartas[b].encontrada).toBe(true)
    expect(estado.pontos).toEqual([PONTOS_POR_PAR, 0])
    expect(estado.vez).toBe(0)
    expect(estado.abertas).toEqual([])
    expect(estado.ultimo).toEqual({ tipo: 'acerto', jogador: 0 })
    expect(estado.cartas[a].dono).toBe(0)
  })

  it('bloqueia após um erro e passa a vez ao desvirar', () => {
    let estado = novoJogo()
    const [a, b] = parErrado(estado.cartas)
    estado = virar(virar(estado, a), b)

    expect(estaBloqueado(estado)).toBe(true)
    expect(estado.ultimo).toEqual({ tipo: 'erro', jogador: 0 })
    const terceira = estado.cartas.findIndex((c) => !c.virada)
    expect(virar(estado, terceira)).toBe(estado)

    estado = reducer(estado, { tipo: 'desvirar' })
    expect(estado.cartas[a].virada || estado.cartas[b].virada).toBe(false)
    expect(estado.vez).toBe(1)
    expect(estaBloqueado(estado)).toBe(false)
  })

  it('no modo solo não troca a vez e conta jogadas', () => {
    let estado = novoJogo('solo')
    const [a, b] = parErrado(estado.cartas)
    estado = reducer(virar(virar(estado, a), b), { tipo: 'desvirar' })
    expect(estado.vez).toBe(0)
    expect(estado.jogadas).toBe(1)
  })

  it('termina quando todos os pares são encontrados', () => {
    let estado = novoJogo()
    const ids = [...new Set(estado.cartas.map((c) => c.figurinha.id))]
    ids.forEach((id, i) => {
      const [a, b] = indicesDoPar(estado.cartas, id)
      estado = virar(virar(estado, a, i), b, 9000)
    })

    expect(estado.fim).toBe(9000)
    expect(estado.jogadas).toBe(PARES)
    expect(estado.pontos[0]).toBe(PARES * PONTOS_POR_PAR)
    expect(estaBloqueado(estado)).toBe(true)
  })

  it('reinicia mantendo o modo e avançando a rodada', () => {
    const estado = virar(novoJogo('solo'), 0)
    const reiniciado = reducer(estado, { tipo: 'reiniciar', cartas: novoJogo().cartas })
    expect(reiniciado.modo).toBe('solo')
    expect(reiniciado.rodada).toBe(1)
    expect(reiniciado.inicio).toBeNull()
    expect(reiniciado.cartas.every((c) => !c.virada)).toBe(true)
  })
})
