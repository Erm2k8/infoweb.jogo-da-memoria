type Arquivos = Record<string, string>

function porNome(arquivos: Arquivos): Arquivos {
  return Object.fromEntries(
    Object.entries(arquivos).map(([caminho, url]) => [caminho.split('/').pop()!.replace(/\.[^.]+$/, ''), url]),
  )
}

const raiz = porNome(import.meta.glob<string>('./*.{svg,png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
}))
const raizPadrao = porNome(import.meta.glob<string>('./placeholder/*.svg', {
  eager: true,
  import: 'default',
}))
const dinoArquivos = porNome(import.meta.glob<string>('./dino/*.{svg,png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
}))
const dinoPadrao = porNome(import.meta.glob<string>('./placeholder/dino/*.svg', {
  eager: true,
  import: 'default',
}))
const figurinhaArquivos = import.meta.glob<string>('./figurinhas/*.{svg,png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
})
const fonteArquivos = import.meta.glob<string>('./fonts/titulo.{woff2,woff,ttf,otf}', {
  eager: true,
  import: 'default',
})

export const imagens = {
  logo: raiz.logo ?? raizPadrao.logo,
  versoCarta: raiz['verso-carta'] ?? raiz.logo ?? raizPadrao.logo,
  nuvem: raiz.nuvem ?? raizPadrao.nuvem,
  cactoGrande: raiz['cacto-grande'] ?? raizPadrao['cacto-grande'],
  cactoPequeno: raiz['cacto-pequeno'] ?? raizPadrao['cacto-pequeno'],
  fotoTurma: raiz['foto-turma'] as string | undefined,
}

const quadro = (nome: string) => dinoArquivos[nome] ?? dinoPadrao[nome]

export const dino = {
  parado: quadro('parado'),
  piscando: quadro('piscando'),
  correndo: [quadro('correndo-1'), quadro('correndo-2')],
  pulando: quadro('pulando'),
  grande: dinoArquivos.grande ?? quadro('parado'),
}

export const figurinhas = Object.entries(figurinhaArquivos)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([caminho, src]) => {
    const id = caminho.split('/').pop()!.replace(/\.[^.]+$/, '')
    const nome = id.replace(/[-_]+/g, ' ').replace(/(^|\s)\p{L}/gu, (letra) => letra.toUpperCase())
    return { id, nome, src }
  })

export const sons = porNome(import.meta.glob<string>('./sons/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  import: 'default',
}))

export const fonteTitulo = Object.values(fonteArquivos)[0] as string | undefined
