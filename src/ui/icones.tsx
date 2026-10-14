import type { ReactNode, SVGProps } from 'react'

function Icone({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

type Props = SVGProps<SVGSVGElement>

export const IconePlay = (p: Props) => (
  <Icone {...p}>
    <path d="M6 3l14 9-14 9z" />
  </Icone>
)

export const IconeAjuda = (p: Props) => (
  <Icone {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </Icone>
)

export const IconePessoas = (p: Props) => (
  <Icone {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
    <path d="M16 3.1a4 4 0 0 1 0 7.8" />
  </Icone>
)

export const IconePessoa = (p: Props) => (
  <Icone {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icone>
)

export const IconeReiniciar = (p: Props) => (
  <Icone {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8" />
    <path d="M3 3v5h5" />
  </Icone>
)

export const IconeVoltar = (p: Props) => (
  <Icone {...p}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </Icone>
)

export const IconeEstrela = (p: Props) => (
  <Icone {...p}>
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </Icone>
)

export const IconeTrofeu = (p: Props) => (
  <Icone {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22" />
    <path d="M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0z" />
  </Icone>
)

export const IconeRelogio = (p: Props) => (
  <Icone {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icone>
)

export const IconeCasa = (p: Props) => (
  <Icone {...p}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Icone>
)

export const IconeFechar = (p: Props) => (
  <Icone {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icone>
)

export const IconeSom = (p: Props) => (
  <Icone {...p}>
    <path d="M11 5 6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 5a10 10 0 0 1 0 14" />
  </Icone>
)

export const IconeMudo = (p: Props) => (
  <Icone {...p}>
    <path d="M11 5 6 9H2v6h4l5 4z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </Icone>
)
