# Jogo da Memória · Acabou, a<main>!

Jogo da memória com as figurinhas favoritas da turma infoweb 2023.1. Tem modo solo (jogadas e tempo) e modo para dois jogadores no mesmo dispositivo, em três dificuldades: Fácil (6 pares), Médio (10) e Difícil (16). Os nomes ficam salvos no `localStorage` do navegador. O ranking é global quando o Supabase está configurado (veja abaixo); sem ele, fica só no navegador.

Feito com Vite, React, TypeScript e Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run test     # testes da lógica do jogo
npm run build    # gera dist/
```

## Ranking online (Supabase)

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No **SQL Editor**, cole e execute o conteúdo de `supabase/schema.sql`. Ele cria as tabelas, deixa a leitura pública e libera a gravação só pelas funções `registrar_solo` e `registrar_duelo`, que validam os dados.
3. Em **Project Settings → API**, copie a URL do projeto e a chave *publishable* (ou a *anon* antiga).
4. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`.
5. Na Vercel, cadastre as mesmas duas variáveis em **Settings → Environment Variables** e faça um novo deploy.

A chave publishable pode ficar no front: ela só permite ler o ranking e chamar as duas funções. Como o jogo roda inteiro no navegador, alguém pode enviar um resultado falso. As validações barram os casos impossíveis (menos jogadas que pares, nome vazio ou longo demais), mas não impedem todo tipo de trapaça.

## Deploy

Importe o repositório na Vercel (ou Netlify, Cloudflare Pages). O preset Vite é detectado sozinho: build `npm run build`, saída `dist`.

## Personalizar

- Imagens, sons e fonte: veja `src/assets/README.md`.
- Textos: `src/content/textos.ts`.
- Cores e medidas: `src/styles/tokens.css`.
