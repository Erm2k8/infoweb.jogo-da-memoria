import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { textos } from '../content/textos'
import { NIVEIS, type Dificuldade } from '../game/dificuldades'
import { CORES_JOGADOR, type Nomes } from '../game/jogadores'
import { Contador, Placar } from '../game/Placar'
import { ReacaoDino, useReacao, type Lado, type Reacao } from '../game/ReacaoDino'
import { estaBloqueado, type Estado, type Jogador, type Modo } from '../game/reducer'
import { Tabuleiro } from '../game/Tabuleiro'
import { formatarTempo, useGame } from '../game/useGame'
import { Vitoria } from '../game/Vitoria'
import { Dino } from '../scene/Dino'
import { Balao } from '../ui/Balao'
import { Botao } from '../ui/Botao'
import { BotaoIcone } from '../ui/BotaoIcone'
import { BotaoMudo } from '../ui/BotaoMudo'
import { IconeAjuda, IconeCasa, IconeEstrela, IconeRelogio, IconeReiniciar } from '../ui/icones'
import { useMediaQuery } from '../ui/useMediaQuery'
import { Tela } from './Tela'
import s from './Jogo.module.css'

const ATRASO_VITORIA = 500
const DURACAO_AVISO = 1100

type Props = {
  modo: Modo
  nomes: Nomes
  dificuldade: Dificuldade
  onRegras: () => void
  onRanking: (destaque?: number) => void
  onInicio: () => void
}

interface Aviso {
  id: number
  texto: string
  cor: string
}

function mensagem({ modo, ultimo, jogadas }: Estado, nomes: Nomes) {
  const { jogo } = textos
  if (!ultimo) return jogo.objetivo
  if (ultimo.tipo === 'acerto') {
    const frase = jogo.acertos[jogadas % jogo.acertos.length]
    return modo === 'duo' ? jogo.acertoDuo(frase, nomes[ultimo.jogador]) : frase
  }
  const frase = jogo.erros[jogadas % jogo.erros.length]
  return modo === 'duo' ? jogo.erroDuo(frase, nomes[ultimo.jogador === 0 ? 1 : 0]) : jogo.erroSolo(frase)
}

export function Jogo({ modo, nomes, dificuldade, onRegras, onRanking, onInicio }: Props) {
  const { estado, virar, reiniciar, segundos, recorde, classificacao } = useGame(modo, nomes, dificuldade)
  const nivel = NIVEIS[dificuldade]
  const colunas = useMediaQuery('(max-aspect-ratio: 3/4)') ? nivel.colunasRetrato : nivel.colunas
  const [mostrarVitoria, setMostrarVitoria] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const acertos = estado.cartas.filter((c) => c.encontrada).length / 2
  const duo = modo === 'duo'
  const [reacaoEsquerda, setReacaoEsquerda] = useReacao()
  const [reacaoDireita, setReacaoDireita] = useReacao()

  const reagir = (jogador: Jogador, tipo: Reacao['tipo']) => {
    const lado: Lado = duo && jogador === 0 ? 'esquerda' : 'direita'
    const mostrar = lado === 'esquerda' ? setReacaoEsquerda : setReacaoDireita
    mostrar({ id: Date.now(), tipo })
  }

  useEffect(() => {
    if (estado.fim === null) return setMostrarVitoria(false)
    const timer = setTimeout(() => setMostrarVitoria(true), ATRASO_VITORIA)
    return () => clearTimeout(timer)
  }, [estado.fim])

  useEffect(() => {
    // A jogada que fecha a partida fica com o modal de vitória.
    if (!estado.ultimo || estado.fim !== null) return
    reagir(estado.ultimo.jogador, estado.ultimo.tipo)
  }, [estado.ultimo])

  useEffect(() => {
    const timer = setTimeout(() => reagir(estado.vez, 'vez'), estado.jogadas === 0 ? 450 : 0)
    return () => clearTimeout(timer)
  }, [estado.vez, estado.rodada])

  useEffect(() => {
    if (!duo) return
    const comeco = estado.jogadas === 0
    const nome = nomes[estado.vez]
    const id = Date.now()
    const atraso = comeco ? 450 : 0
    const mostrar = setTimeout(
      () => setAviso({ id, cor: CORES_JOGADOR[estado.vez], texto: comeco ? textos.jogo.comeca(nome) : textos.jogo.vez(nome) }),
      atraso,
    )
    const esconder = setTimeout(() => setAviso((a) => (a?.id === id ? null : a)), atraso + DURACAO_AVISO)
    return () => {
      clearTimeout(mostrar)
      clearTimeout(esconder)
    }
  }, [duo, estado.vez, estado.rodada])

  return (
    <Tela className={s.tela}>
      <header className={s.topo}>
        <div className={s.faixa}>
          <Dino largura="var(--dino)" pulo={acertos} alturaPulo={15} entrarCorrendo className={s.dino} />
          <Balao key={`${estado.rodada}-${estado.jogadas}`} texto={mensagem(estado, nomes)} className={s.balao} />
          <div className={s.icones}>
            <BotaoIcone aria-label={textos.jogo.inicio} onClick={onInicio}>
              <IconeCasa />
            </BotaoIcone>
            <BotaoMudo />
          </div>
        </div>

        <div className={s.controles}>
          {duo ? (
            <Placar
              rotulo={nomes[0]}
              icone="1"
              cor={CORES_JOGADOR[0]}
              vez={estado.vez === 0}
              pulso={estado.pontos[0]}
            >
              <Contador valor={estado.pontos[0]} /> {textos.jogo.pontos}
            </Placar>
          ) : (
            <Placar rotulo={textos.jogo.jogadas} icone={<IconeEstrela />} pulso={acertos}>
              <Contador valor={estado.jogadas} />
            </Placar>
          )}

          <div className={s.acoes}>
            <Botao
              cor="laranja"
              icone={<IconeReiniciar />}
              animacaoIcone={{ rotate: -360 }}
              aria-label={textos.jogo.reiniciar}
              onClick={reiniciar}
            >
              {textos.jogo.reiniciar}
            </Botao>
            <Botao
              cor="azul"
              icone={<IconeAjuda />}
              animacaoIcone={{ rotate: [0, -15, 15, 0] }}
              aria-label={textos.jogo.regras}
              onClick={onRegras}
            >
              {textos.jogo.regras}
            </Botao>
          </div>

          {duo ? (
            <Placar
              rotulo={nomes[1]}
              icone="2"
              cor={CORES_JOGADOR[1]}
              lado="direita"
              vez={estado.vez === 1}
              pulso={estado.pontos[1]}
            >
              <Contador valor={estado.pontos[1]} /> {textos.jogo.pontos}
            </Placar>
          ) : (
            <Placar
              rotulo={textos.jogo.tempo}
              icone={<IconeRelogio />}
              lado="direita"
              destaque={recorde && `${textos.jogo.recorde}: ${recorde.jogadas} · ${formatarTempo(recorde.segundos)}`}
            >
              {formatarTempo(segundos)}
            </Placar>
          )}
        </div>
      </header>

      <div className={s.area}>
        <AnimatePresence mode="wait">
          <Tabuleiro
            key={estado.rodada}
            cartas={estado.cartas}
            abertas={estado.abertas}
            bloqueado={estaBloqueado(estado)}
            colunas={colunas}
            corVez={duo ? CORES_JOGADOR[estado.vez] : undefined}
            onVirar={virar}
          />
        </AnimatePresence>

        <AnimatePresence>
          {aviso && (
            <motion.div
              key={aviso.id}
              className={s.aviso}
              style={{ '--cor': aviso.cor } as CSSProperties}
              role="status"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            >
              {aviso.texto}
            </motion.div>
          )}
        </AnimatePresence>

        <ReacaoDino reacao={reacaoEsquerda} lado="esquerda" cor={duo ? CORES_JOGADOR[0] : undefined} />
        <ReacaoDino reacao={reacaoDireita} lado="direita" cor={duo ? CORES_JOGADOR[1] : undefined} />
      </div>

      <AnimatePresence>
        {mostrarVitoria && (
          <Vitoria
            estado={estado}
            nomes={nomes}
            dificuldade={dificuldade}
            segundos={segundos}
            classificacao={classificacao}
            onJogarDeNovo={reiniciar}
            onRanking={() => onRanking(classificacao?.id)}
            onInicio={onInicio}
          />
        )}
      </AnimatePresence>
    </Tela>
  )
}
