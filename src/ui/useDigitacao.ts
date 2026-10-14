import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function useDigitacao(texto: string, { velocidade = 16, atraso = 0 } = {}) {
  const reduzir = useReducedMotion()
  const [estado, setEstado] = useState({ texto, letras: 0 })
  const letras = estado.texto === texto ? estado.letras : 0
  const completo = reduzir || letras >= texto.length

  useEffect(() => {
    if (completo) return
    const timer = setTimeout(
      () => setEstado({ texto, letras: letras + 1 }),
      letras === 0 ? atraso + velocidade : velocidade,
    )
    return () => clearTimeout(timer)
  }, [texto, letras, completo, velocidade, atraso])

  return {
    visivel: completo ? texto : texto.slice(0, letras),
    resto: completo ? '' : texto.slice(letras),
    completo,
    completar: () => setEstado({ texto, letras: texto.length }),
  }
}
