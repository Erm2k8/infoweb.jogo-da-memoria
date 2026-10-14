# Assets

Coloque os arquivos nesta pasta com os nomes abaixo. A extensão pode ser qualquer formato de imagem (`.svg`, `.png`, `.webp`, `.jpg`…). Quando um arquivo não existe, o jogo usa a versão provisória de `placeholder/`.

| Arquivo | Uso |
|---|---|
| `logo.*` | Logo "Acabou, a(main)!" (tela inicial e verso das cartas) |
| `verso-carta.*` | Verso das cartas (opcional, usa o logo se não existir) |
| `nuvem.*`, `cacto-grande.*`, `cacto-pequeno.*` | Cenário |
| `foto-turma.*` | Foto da tela "Quem somos" |
| `dino/parado.*`, `dino/piscando.*`, `dino/correndo-1.*`, `dino/correndo-2.*`, `dino/pulando.*` | Quadros do Infocléber |
| `dino/grande.*` | Infocléber no diálogo de regras (opcional, usa `parado`) |
| `figurinhas/*` | Figurinhas das cartas. O nome do arquivo vira o nome lido pelo leitor de tela (`maria-clara.webp` → "Maria Clara"). Com mais de 16, cada partida sorteia 16; com menos, o jogo completa com cartas numeradas. |
| `sons/virar.*`, `sons/acerto.*`, `sons/erro.*`, `sons/vitoria.*`, `sons/clique.*` | Efeitos sonoros (`.mp3`, `.ogg`, `.wav`, `.m4a`). Sem eles, o jogo toca bipes sintetizados. |
| `fonts/titulo.woff2` | Fonte original do título (opcional, o padrão é Pixelify Sans) |

Os textos ficam em `src/content/textos.ts`.
