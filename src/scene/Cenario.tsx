import type { CSSProperties } from 'react'
import { imagens } from '../assets'
import { VELOCIDADE_PISTA } from './Pista'
import s from './Cenario.module.css'

const LARGURA_PEDRINHAS = 600

const nuvens = [
  { topo: '20%', largura: 230, duracao: 95, atraso: -70 },
  { topo: '29%', largura: 240, duracao: 120, atraso: -20 },
  { topo: '7%', largura: 160, duracao: 150, atraso: -110 },
]

export function Cenario({ correndo = false }: { correndo?: boolean }) {
  return (
    <div className={s.cenario} aria-hidden>
      {nuvens.map((nuvem, i) => (
        <img
          key={i}
          src={imagens.nuvem}
          alt=""
          className={s.nuvem}
          style={
            {
              top: nuvem.topo,
              width: nuvem.largura,
              '--duracao': `${nuvem.duracao}s`,
              '--atraso': `${nuvem.atraso}s`,
            } as CSSProperties
          }
        />
      ))}
      <img src={imagens.cactoGrande} alt="" className={`${s.cacto} ${s.grandeEsquerda}`} />
      <img src={imagens.cactoPequeno} alt="" className={`${s.cacto} ${s.pequenoEsquerda}`} />
      <img src={imagens.cactoGrande} alt="" className={`${s.cacto} ${s.grandeDireita}`} />
      <img src={imagens.cactoPequeno} alt="" className={`${s.cacto} ${s.pequenoDireita}`} />
      <div className={s.chao}>
        <div
          className={s.pedrinhas}
          style={correndo ? { animationDuration: `${LARGURA_PEDRINHAS / VELOCIDADE_PISTA}s` } : undefined}
        />
      </div>
    </div>
  )
}
