import { AnimatePresence, motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { textos } from '../content/textos'
import { lerDificuldade, salvarDificuldade, type Dificuldade } from '../game/dificuldades'
import { CORES_JOGADOR, LIMITE_NOME, lerNomes, normalizarNomes, salvarNomes, type Nomes } from '../game/jogadores'
import type { Modo } from '../game/reducer'
import { SeletorDificuldade } from '../game/SeletorDificuldade'
import { Botao } from '../ui/Botao'
import { IconePessoa, IconePessoas, IconePlay, IconeVoltar } from '../ui/icones'
import { Modal } from '../ui/Modal'
import s from './EscolhaJogo.module.css'

type Props = {
  onJogar: (modo: Modo, nomes: Nomes, dificuldade: Dificuldade) => void
  onFechar: () => void
}

const { modos: t } = textos

const opcoes = [
  { modo: 'solo', icone: <IconePessoa />, cor: 'var(--blue)', ...t.solo },
  { modo: 'duo', icone: <IconePessoas />, cor: 'var(--green)', ...t.duo },
] as const

const passo = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.15 },
}

export function EscolhaJogo({ onJogar, onFechar }: Props) {
  const [modo, setModo] = useState<Modo | null>(null)
  const [nomes, setNomes] = useState<string[]>(lerNomes)
  const [dificuldade, setDificuldade] = useState(lerDificuldade)
  const quantidade = modo === 'duo' ? 2 : 1
  const titulo = modo === null ? t.titulo : modo === 'solo' ? t.nomeTitulo : t.nomesTitulo

  const comecar = () => {
    if (!modo) return
    const escolhidos = nomes.slice(0, quantidade)
    salvarNomes(escolhidos)
    salvarDificuldade(dificuldade)
    onJogar(modo, normalizarNomes(escolhidos), dificuldade)
  }

  return (
    <Modal titulo={titulo} onFechar={onFechar}>
      <AnimatePresence mode="wait" initial={false}>
        {modo === null ? (
          <motion.div key="modos" className={s.modos} {...passo}>
            {opcoes.map((opcao, i) => (
              <motion.button
                key={opcao.modo}
                type="button"
                className={s.modo}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModo(opcao.modo)}
              >
                <span className={s.modoIcone} style={{ background: opcao.cor }}>
                  {opcao.icone}
                </span>
                <strong className={s.modoTitulo}>{opcao.titulo}</strong>
                <span className={s.modoDescricao}>{opcao.descricao}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.form
            key="nomes"
            className={s.form}
            {...passo}
            onSubmit={(evento) => {
              evento.preventDefault()
              comecar()
            }}
          >
            {Array.from({ length: quantidade }, (_, i) => (
              <label key={i} className={s.campo} style={{ '--cor': CORES_JOGADOR[i] } as CSSProperties}>
                <span className={s.avatar} aria-hidden>
                  {modo === 'solo' ? <IconePessoa /> : i + 1}
                </span>
                <span className="sr-only">{modo === 'solo' ? t.nomeSolo : t.nomeRotulo(i + 1)}</span>
                <input
                  className={s.input}
                  value={nomes[i] ?? ''}
                  maxLength={LIMITE_NOME}
                  placeholder={modo === 'solo' ? t.nomeSolo : textos.jogo.jogador(i + 1)}
                  autoComplete="off"
                  autoFocus={i === 0}
                  onChange={(evento) => setNomes((atuais) => atuais.map((n, j) => (j === i ? evento.target.value : n)))}
                />
              </label>
            ))}
            <fieldset className={s.dificuldade}>
              <legend>{textos.dificuldades.titulo}</legend>
              <SeletorDificuldade valor={dificuldade} onChange={setDificuldade} grupo="escolha" />
            </fieldset>
            <div className={s.acoes}>
              <Botao cor="azul" icone={<IconeVoltar />} animacaoIcone={{ x: -4 }} onClick={() => setModo(null)}>
                {t.voltar}
              </Botao>
              <Botao cor="verde" type="submit" icone={<IconePlay />} animacaoIcone={{ x: 4 }}>
                {t.comecar}
              </Botao>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  )
}
