export interface Figurinha {
  id: string
  nome: string
  imagens?: readonly [string, string]
  numero: number
}

export interface Carta {
  id: number
  figurinha: Figurinha
  lado: 0 | 1
  virada: boolean
  encontrada: boolean
  dono: 0 | 1 | null
}

export type Aleatorio = () => number

export function embaralhar<T>(lista: readonly T[], aleatorio: Aleatorio = Math.random): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function escolherFigurinhas(
  disponiveis: readonly Omit<Figurinha, 'numero'>[],
  pares: number,
  nomePadrao: (n: number) => string,
  aleatorio: Aleatorio = Math.random,
): Figurinha[] {
  const escolhidas = embaralhar(disponiveis, aleatorio).slice(0, pares)
  return Array.from({ length: pares }, (_, i) => {
    const numero = i + 1
    return escolhidas[i]
      ? { ...escolhidas[i], numero }
      : { id: `padrao-${numero}`, nome: nomePadrao(numero), numero }
  })
}

export function criarCartas(figurinhas: readonly Figurinha[], aleatorio: Aleatorio = Math.random): Carta[] {
  const pares = figurinhas.flatMap((figurinha) => [0, 1].map((lado) => ({ figurinha, lado: lado as 0 | 1 })))
  return embaralhar(pares, aleatorio).map(({ figurinha, lado }, id) => ({
    id,
    figurinha,
    lado,
    virada: false,
    encontrada: false,
    dono: null,
  }))
}
