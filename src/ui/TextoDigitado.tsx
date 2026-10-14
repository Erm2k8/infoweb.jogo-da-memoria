import s from './TextoDigitado.module.css'

export function TextoDigitado({ texto, visivel, resto }: { texto: string; visivel: string; resto: string }) {
  return (
    <>
      <span className="sr-only">{texto}</span>
      <span aria-hidden>
        {visivel}
        <span className={s.resto}>{resto}</span>
      </span>
    </>
  )
}
