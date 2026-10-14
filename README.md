# Jogo da Memória · Acabou, a<main>!

Jogo da memória com as figurinhas favoritas da turma infoweb 2023.1. Tem modo solo (jogadas e tempo) e modo para dois jogadores no mesmo dispositivo, em três dificuldades: Fácil (6 pares), Médio (10) e Difícil (16). Os nomes e o ranking ficam salvos no `localStorage` do navegador.

Feito com Vite, React, TypeScript e Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run test     # testes da lógica do jogo
npm run build    # gera dist/
```

## Deploy

Importe o repositório na Vercel (ou Netlify, Cloudflare Pages). O preset Vite é detectado sozinho: build `npm run build`, saída `dist`.

## Personalizar

- Imagens, sons e fonte: veja `src/assets/README.md`.
- Textos: `src/content/textos.ts`.
- Cores e medidas: `src/styles/tokens.css`.
