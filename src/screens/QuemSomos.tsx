import { motion } from 'motion/react'
import { imagens } from '../assets'
import { textos } from '../content/textos'
import { Dino } from '../scene/Dino'
import { Botao } from '../ui/Botao'
import { IconeVoltar } from '../ui/icones'
import { TextoDigitado } from '../ui/TextoDigitado'
import { useDigitacao } from '../ui/useDigitacao'
import { Tela } from './Tela'
import s from './QuemSomos.module.css'

export function QuemSomos({ onVoltar }: { onVoltar: () => void }) {
  const { quemSomos } = textos
  const digitacao = useDigitacao(quemSomos.texto, { velocidade: 12, atraso: 500 })

  return (
    <Tela className={s.tela}>
      <div className={s.conteudo}>
        <div className={s.esquerda}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Botao cor="azul" icone={<IconeVoltar />} animacaoIcone={{ x: -4 }} onClick={onVoltar}>
              {quemSomos.voltar}
            </Botao>
          </motion.div>
          <motion.h1
            className={s.titulo}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24, delay: 0.05 }}
          >
            {quemSomos.titulo}
          </motion.h1>
          <motion.div
            className={s.foto}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ rotate: -1.5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.1 }}
          >
            {imagens.fotoTurma ? (
              <img src={imagens.fotoTurma} alt={quemSomos.fotoAlt} />
            ) : (
              <span className={s.fotoPendente}>{quemSomos.fotoPendente}</span>
            )}
          </motion.div>
        </div>

        <motion.div
          className={s.caixa}
          initial={{ clipPath: 'inset(0 100% 100% 0 round 28px)' }}
          animate={{ clipPath: 'inset(0 0% 0% 0 round 28px)' }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
        >
          <p className={s.texto}>
            <TextoDigitado texto={quemSomos.texto} {...digitacao} />
          </p>
        </motion.div>
      </div>

      <div className={s.dino}>
        <Dino largura="100%" entrarCorrendo />
      </div>
    </Tela>
  )
}
