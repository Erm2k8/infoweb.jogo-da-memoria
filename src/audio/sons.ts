import { useSyncExternalStore } from 'react'
import { ler, salvar } from '../armazenamento'
import { sons as arquivos } from '../assets'

export type Som = 'virar' | 'acerto' | 'erro' | 'vitoria' | 'clique'

const melodias: Record<Som, { onda: OscillatorType; notas: number[]; duracao: number }> = {
  clique: { onda: 'square', notas: [880], duracao: 0.04 },
  virar: { onda: 'triangle', notas: [520, 780], duracao: 0.05 },
  acerto: { onda: 'square', notas: [523, 659, 784, 1047], duracao: 0.08 },
  erro: { onda: 'square', notas: [262, 196], duracao: 0.14 },
  vitoria: { onda: 'square', notas: [523, 659, 784, 1047, 784, 1047, 1319], duracao: 0.12 },
}

let mudo = ler('mudo', false)
let contexto: AudioContext | undefined
const ouvintes = new Set<() => void>()

function sintetizar(som: Som) {
  contexto ??= new AudioContext()
  const { onda, notas, duracao } = melodias[som]
  const inicio = contexto.currentTime
  notas.forEach((frequencia, i) => {
    const osc = contexto!.createOscillator()
    const volume = contexto!.createGain()
    const t = inicio + i * duracao
    osc.type = onda
    osc.frequency.value = frequencia
    volume.gain.setValueAtTime(0.06, t)
    volume.gain.exponentialRampToValueAtTime(0.001, t + duracao * 0.95)
    osc.connect(volume).connect(contexto!.destination)
    osc.start(t)
    osc.stop(t + duracao)
  })
}

export function tocar(som: Som) {
  if (mudo) return
  const url = arquivos[som]
  if (url) {
    new Audio(url).play().catch(() => {})
    return
  }
  try {
    sintetizar(som)
  } catch {
    // Navegadores sem Web Audio simplesmente ficam sem som.
  }
}

export function alternarMudo() {
  mudo = !mudo
  salvar('mudo', mudo)
  ouvintes.forEach((avisar) => avisar())
}

export function useMudo() {
  return useSyncExternalStore(
    (avisar) => {
      ouvintes.add(avisar)
      return () => ouvintes.delete(avisar)
    },
    () => mudo,
  )
}
