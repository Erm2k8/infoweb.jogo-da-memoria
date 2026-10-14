import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { imagens } from '../assets'
import { textos } from '../content/textos'
import type { Dificuldade } from '../game/dificuldades'
import type { Nomes } from '../game/jogadores'
import type { Modo } from '../game/reducer'
import { Dino } from '../scene/Dino'
import { Pista } from '../scene/Pista'
import { Balao } from '../ui/Balao'
import { Botao } from '../ui/Botao'
import { IconeAjuda, IconePessoas, IconePlay, IconeTrofeu } from '../ui/icones'
import { CONSULTA_MOBILE, useMediaQuery } from '../ui/useMediaQuery'
import { EscolhaJogo } from './EscolhaJogo'
import { Tela } from './Tela'
import s from './Inicio.module.css'

type Props = {
  onJogar: (modo: Modo, nomes: Nomes, dificuldade: Dificuldade) => void
  onRegras: () => void
  onRanking: () => void
  onQuemSomos: () => void
}

const ATRASO_LETRAS = 0.1
const letras = textos.tituloLinhas.map((linha) => [...linha])
const inicioLinha = letras.map((_, i) => letras.slice(0, i).reduce((total, l) => total + l.length, 0))

const entradaBotao = {
  oculto: { opacity: 0, y: 24, scale: 0.9 },
  visivel: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 24 } },
} as const

export function Inicio({ onJogar, onRegras, onRanking, onQuemSomos }: Props) {
  const [escolhendo, setEscolhendo] = useState(false)
  const [pulos, setPulos] = useState(0)
  const personagem = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const mobile = useMediaQuery(CONSULTA_MOBILE)

  return (
    <Tela className={s.tela}>
      <motion.img
        src={imagens.logo}
        alt={textos.marca}
        className={s.logo}
        initial={{ y: -40, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      />

      <h1 className={s.titulo} aria-label={textos.titulo}>
        {letras.map((linha, l) => (
          <span key={l} className={s.linha} aria-hidden>
            {linha.map((letra, i) => (
              <motion.span
                key={i}
                className={letra === ' ' ? s.espaco : s.letra}
                initial={{ y: -180, opacity: 0, rotate: i % 2 ? 12 : -12 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                whileHover={{ y: -12, transition: { type: 'spring', stiffness: 600, damping: 10 } }}
                transition={{
                  type: 'spring',
                  stiffness: 520,
                  damping: 18,
                  delay: ATRASO_LETRAS + (inicioLinha[l] + i) * 0.025,
                }}
              >
                {letra}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      <motion.div
        className={s.botoes}
        initial="oculto"
        animate="visivel"
        variants={{ visivel: { transition: { delayChildren: 0.3, staggerChildren: 0.06 } } }}
      >
        <motion.div variants={entradaBotao}>
          <Botao
            cor="verde"
            tamanho="grande"
            icone={<IconePlay />}
            animacaoIcone={{ x: [0, 6, 0], transition: { duration: 0.5, repeat: Infinity } }}
            onClick={() => setEscolhendo(true)}
          >
            {textos.inicio.iniciar}
          </Botao>
        </motion.div>
        <motion.div variants={entradaBotao}>
          <Botao
            cor="azul"
            tamanho="grande"
            icone={<IconeAjuda />}
            animacaoIcone={{ rotate: [0, -15, 15, 0], transition: { duration: 0.5 } }}
            onClick={onRegras}
          >
            {textos.inicio.regras}
          </Botao>
        </motion.div>
        <motion.div variants={entradaBotao}>
          <Botao
            cor="amarelo"
            tamanho="grande"
            icone={<IconeTrofeu />}
            animacaoIcone={{ y: [0, -4, 0], rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
            onClick={onRanking}
          >
            {textos.inicio.ranking}
          </Botao>
        </motion.div>
        <motion.div variants={entradaBotao}>
          <Botao
            cor="laranja"
            tamanho="grande"
            icone={<IconePessoas />}
            animacaoIcone={{ y: [0, -4, 0], transition: { duration: 0.35, repeat: Infinity } }}
            onClick={onQuemSomos}
          >
            {textos.inicio.quemSomos}
          </Botao>
        </motion.div>
      </motion.div>

      {!mobile && (
        <>
          <Pista dino={personagem} onPular={() => setPulos((n) => n + 1)} />

          <div ref={personagem} className={s.personagem}>
            <Dino largura="100%" entrarCorrendo correndo={!reduzir} pulo={pulos} alturaPulo={100} duracaoPulo={0.6}>
              <Balao texto={textos.inicio.saudacao} rabicho atraso={500} className={s.balao} />
            </Dino>
          </div>
        </>
      )}

      <AnimatePresence>
        {escolhendo && <EscolhaJogo onJogar={onJogar} onFechar={() => setEscolhendo(false)} />}
      </AnimatePresence>
    </Tela>
  )
}
