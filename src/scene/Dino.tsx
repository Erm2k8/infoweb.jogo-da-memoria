import { motion, useAnimate, type AnimationOptions } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { dino } from '../assets'
import { textos } from '../content/textos'
import s from './Dino.module.css'

if (typeof window !== 'undefined') {
  for (const src of [dino.parado, dino.piscando, dino.pulando, ...dino.correndo]) new Image().src = src
}

type Props = {
  largura: string
  pulo?: number
  correndo?: boolean
  entrarCorrendo?: boolean
  alturaPulo?: number
  duracaoPulo?: number
  className?: string
  children?: ReactNode
}

export function Dino({
  largura,
  pulo = 0,
  correndo = false,
  entrarCorrendo = false,
  alturaPulo = 55,
  duracaoPulo = 0.45,
  className,
  children,
}: Props) {
  const [escopo, animar] = useAnimate<HTMLDivElement>()
  const botao = useRef<HTMLButtonElement>(null)
  const [chegou, setChegou] = useState(!entrarCorrendo)
  const [quadro, setQuadro] = useState(0)
  const [piscando, setPiscando] = useState(false)
  const [pulando, setPulando] = useState(false)
  const pulandoRef = useRef(false)
  const corre = correndo || !chegou

  useEffect(() => {
    if (!corre) return
    const timer = setInterval(() => setQuadro((q) => 1 - q), 90)
    return () => clearInterval(timer)
  }, [corre])

  useEffect(() => {
    if (corre) return
    let timer: ReturnType<typeof setTimeout>
    const agendar = () => {
      timer = setTimeout(() => {
        setPiscando(true)
        timer = setTimeout(() => {
          setPiscando(false)
          agendar()
        }, 140)
      }, 2000 + Math.random() * 3000)
    }
    agendar()
    return () => clearTimeout(timer)
  }, [corre])

  const pular = async () => {
    if (pulandoRef.current || !escopo.current || !botao.current) return
    pulandoRef.current = true
    setPulando(true)
    const opcoes: AnimationOptions = { duration: duracaoPulo, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] }
    // O salto leva junto o que estiver preso ao dino (como o balão); só o dino achata.
    await Promise.all([
      animar(escopo.current, { y: ['0%', `-${alturaPulo}%`, '0%'] }, opcoes),
      animar(botao.current, { scaleY: [1, 1.04, 0.94, 1] }, opcoes),
    ])
    pulandoRef.current = false
    setPulando(false)
  }

  useEffect(() => {
    if (pulo > 0) pular()
  }, [pulo])

  const src = pulando ? dino.pulando : corre ? dino.correndo[quadro] : piscando ? dino.piscando : dino.parado

  return (
    <motion.div
      className={[s.dino, className].filter(Boolean).join(' ')}
      style={{ width: largura }}
      initial={entrarCorrendo ? { x: '-70vw' } : false}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.4, 1] }}
      onAnimationComplete={() => setChegou(true)}
    >
      <div ref={escopo} className={s.salto}>
        <button ref={botao} type="button" className={s.botao} onClick={pular} aria-label={textos.regras.nome}>
          <img src={src} alt="" className="pixelado" draggable={false} />
        </button>
        {children}
      </div>
    </motion.div>
  )
}
