import { motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { textos } from '../content/textos'
import { Dino } from '../scene/Dino'
import { Botao } from '../ui/Botao'
import { IconeCasa, IconeReiniciar, IconeTrofeu } from '../ui/icones'
import { Modal } from '../ui/Modal'
import type { Dificuldade } from './dificuldades'
import { CORES_JOGADOR, type Nomes } from './jogadores'
import type { Estado } from './reducer'
import { formatarTempo, vencedor, type Classificacao } from './useGame'
import s from './Vitoria.module.css'

const cores = ['#facc15', '#eb4925', '#2563eb', '#0fb42d', '#d5781b', '#7436dd', '#d66d64']

function criarConfete() {
  return Array.from({ length: 70 }, (_, i) => ({
    x: Math.random() * 100,
    deriva: (Math.random() - 0.5) * 30,
    giro: (Math.random() - 0.5) * 1080,
    tamanho: 8 + Math.random() * 8,
    duracao: 2 + Math.random() * 1.6,
    atraso: Math.random() * 0.5,
    cor: cores[i % cores.length],
  }))
}

type Props = {
  estado: Estado
  nomes: Nomes
  dificuldade: Dificuldade
  segundos: number
  classificacao: Classificacao | null
  onJogarDeNovo: () => void
  onRanking: () => void
  onInicio: () => void
}

export function Vitoria({
  estado,
  nomes,
  dificuldade,
  segundos,
  classificacao,
  onJogarDeNovo,
  onRanking,
  onInicio,
}: Props) {
  const [confete] = useState(criarConfete)
  const [pulos, setPulos] = useState(1)
  const ganhador = vencedor(estado)

  useEffect(() => {
    const timer = setInterval(() => setPulos((n) => n + 1), 700)
    return () => clearInterval(timer)
  }, [])

  const titulo =
    estado.modo === 'solo'
      ? textos.vitoria.titulo
      : ganhador === null
        ? textos.vitoria.empate
        : textos.vitoria.vencedor(nomes[ganhador])

  const posicao = classificacao?.posicao
  const nivel = textos.dificuldades[dificuldade]

  return (
    <>
      <div className={s.confete} aria-hidden>
        {confete.map((peca, i) => (
          <motion.span
            key={i}
            style={{ left: `${peca.x}%`, width: peca.tamanho, height: peca.tamanho, background: peca.cor }}
            initial={{ y: '-10vh', x: 0, rotate: 0 }}
            animate={{ y: '110vh', x: `${peca.deriva}vw`, rotate: peca.giro }}
            transition={{ duration: peca.duracao, delay: peca.atraso, ease: 'linear' }}
          />
        ))}
      </div>
      <Modal titulo={titulo}>
        <div className={s.dino}>
          <Dino largura="88px" pulo={pulos} />
        </div>
        {estado.modo === 'solo' ? (
          <p className={s.mensagem}>{textos.vitoria.solo(estado.jogadas, formatarTempo(segundos), nivel)}</p>
        ) : (
          <div className={s.pontos}>
            {nomes.map((nome, i) => (
              <div
                key={i}
                className={`${s.jogador} ${ganhador === i ? s.ganhador : ''}`}
                style={{ '--cor': CORES_JOGADOR[i] } as CSSProperties}
              >
                <span>{nome}</span>
                <strong>
                  {estado.pontos[i]} {textos.jogo.pontos}
                </strong>
              </div>
            ))}
          </div>
        )}
        {posicao && (
          <motion.p
            className={s.recorde}
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 0.25 }}
          >
            {posicao === 1 ? textos.vitoria.novoRecorde : textos.vitoria.posicao(posicao, nivel)}
          </motion.p>
        )}
        <div className={s.botoes}>
          <Botao cor="verde" icone={<IconeReiniciar />} animacaoIcone={{ rotate: -360 }} onClick={onJogarDeNovo}>
            {textos.vitoria.jogarDeNovo}
          </Botao>
          <Botao cor="amarelo" icone={<IconeTrofeu />} animacaoIcone={{ y: [0, -3, 0] }} onClick={onRanking}>
            {textos.vitoria.ranking}
          </Botao>
          <Botao cor="azul" icone={<IconeCasa />} onClick={onInicio}>
            {textos.vitoria.inicio}
          </Botao>
        </div>
      </Modal>
    </>
  )
}
