import { AnimatePresence, MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { lerDificuldade, type Dificuldade } from './game/dificuldades'
import { normalizarNomes, type Nomes } from './game/jogadores'
import { RankingModal, type Aba } from './game/RankingModal'
import type { Modo } from './game/reducer'
import { Cenario } from './scene/Cenario'
import { Inicio } from './screens/Inicio'
import { Jogo } from './screens/Jogo'
import { QuemSomos } from './screens/QuemSomos'
import { BotaoMudo } from './ui/BotaoMudo'
import { DialogoInfocleber } from './ui/DialogoInfocleber'

type Tela = 'inicio' | 'jogo' | 'quem-somos'

export function App() {
  const [tela, setTela] = useState<Tela>('inicio')
  const [modo, setModo] = useState<Modo>('duo')
  const [nomes, setNomes] = useState<Nomes>(() => normalizarNomes([]))
  const [dificuldade, setDificuldade] = useState<Dificuldade>(lerDificuldade)
  const [regras, setRegras] = useState(false)
  const [ranking, setRanking] = useState<{ aba: Aba; dificuldade: Dificuldade; destaque?: number } | null>(null)

  const abrirRegras = useCallback(() => setRegras(true), [])
  const fecharRegras = useCallback(() => setRegras(false), [])
  const fecharRanking = useCallback(() => setRanking(null), [])
  const irParaInicio = useCallback(() => setTela('inicio'), [])

  return (
    <MotionConfig reducedMotion="user">
      <Cenario correndo={tela === 'inicio'} />
      <AnimatePresence mode="wait">
        {tela === 'inicio' && (
          <Inicio
            key="inicio"
            onJogar={(escolhido, jogadores, nivel) => {
              setModo(escolhido)
              setNomes(jogadores)
              setDificuldade(nivel)
              setTela('jogo')
            }}
            onRegras={abrirRegras}
            onRanking={() => setRanking({ aba: 'solo', dificuldade })}
            onQuemSomos={() => setTela('quem-somos')}
          />
        )}
        {tela === 'jogo' && (
          <Jogo
            key="jogo"
            modo={modo}
            nomes={nomes}
            dificuldade={dificuldade}
            onRegras={abrirRegras}
            onRanking={(destaque) => setRanking({ aba: modo === 'duo' ? 'duelos' : 'solo', dificuldade, destaque })}
            onInicio={irParaInicio}
          />
        )}
        {tela === 'quem-somos' && <QuemSomos key="quem-somos" onVoltar={irParaInicio} />}
      </AnimatePresence>
      <AnimatePresence>{regras && <DialogoInfocleber onFechar={fecharRegras} />}</AnimatePresence>
      <AnimatePresence>
        {ranking && <RankingModal {...ranking} onFechar={fecharRanking} />}
      </AnimatePresence>
      {tela !== 'jogo' && <BotaoMudo fixo />}
    </MotionConfig>
  )
}
