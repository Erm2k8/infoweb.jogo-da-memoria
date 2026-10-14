import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { textos } from '../content/textos'
import { Modal } from '../ui/Modal'
import { RECOMENDADA, type Dificuldade } from './dificuldades'
import { lerRanking } from './ranking'
import { SeletorDificuldade } from './SeletorDificuldade'
import { formatarTempo } from './useGame'
import s from './RankingModal.module.css'

export type Aba = 'solo' | 'duelos'

type Props = {
  aba?: Aba
  dificuldade?: Dificuldade
  destaque?: number
  onFechar: () => void
}

const { ranking: t } = textos

export function RankingModal({
  aba: abaInicial = 'solo',
  dificuldade: nivelInicial = RECOMENDADA,
  destaque,
  onFechar,
}: Props) {
  const [aba, setAba] = useState(abaInicial)
  const [nivel, setNivel] = useState(nivelInicial)
  const [ranking] = useState(lerRanking)

  const linhas =
    aba === 'solo'
      ? ranking.solo[nivel].map((r) => ({
          chave: String(r.id),
          nome: r.nome,
          valores: [r.jogadas, formatarTempo(r.segundos)],
          destaque: r.id === destaque,
        }))
      : ranking.duelos.slice(0, 10).map((d) => ({
          chave: d.nome,
          nome: d.nome,
          valores: [d.vitorias, d.partidas],
          destaque: false,
        }))
  const colunas = aba === 'solo' ? [t.jogadas, t.tempo] : [t.vitorias, t.partidas]

  return (
    <Modal titulo={t.titulo} onFechar={onFechar}>
      <div className={s.abas} role="tablist">
        {(['solo', 'duelos'] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            role="tab"
            aria-selected={aba === opcao}
            className={s.aba}
            onClick={() => setAba(opcao)}
          >
            {aba === opcao && <motion.span layoutId="aba-ranking" className={s.marcador} />}
            <span>{opcao === 'solo' ? t.solo : t.duelos}</span>
          </button>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {aba === 'solo' && (
          <motion.div
            className={s.niveis}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <SeletorDificuldade valor={nivel} onChange={setNivel} grupo="ranking" compacto />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={aba === 'solo' ? nivel : aba}
          role="tabpanel"
          initial={{ opacity: 0, x: aba === 'solo' ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {linhas.length === 0 ? (
            <p className={s.vazio}>{aba === 'solo' ? t.vazioSolo : t.vazioDuelos}</p>
          ) : (
            <table className={s.tabela}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.jogador}</th>
                  {colunas.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha, i) => (
                  <motion.tr
                    key={linha.chave}
                    className={linha.destaque ? s.destaque : undefined}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>
                      <span className={`${s.posicao} ${s[`p${i + 1}`] ?? ''}`}>{i + 1}</span>
                    </td>
                    <td className={s.nome}>{linha.nome}</td>
                    {linha.valores.map((valor, j) => (
                      <td key={j} className={s.numero}>
                        {valor}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </AnimatePresence>

      <p className={s.aviso}>{t.aviso}</p>
    </Modal>
  )
}
