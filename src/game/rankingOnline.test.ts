import { afterEach, describe, expect, it, vi } from 'vitest'

async function carregarOnline(respostas: (url: string, init?: RequestInit) => unknown) {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://teste.supabase.co')
  vi.stubEnv('VITE_SUPABASE_KEY', 'sb_publishable_teste')
  const fetch = vi.fn(async (url: string, init?: RequestInit) => new Response(JSON.stringify(respostas(url, init))))
  vi.stubGlobal('fetch', fetch)
  vi.resetModules()
  return { ranking: await import('./ranking'), fetch }
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('ranking online', () => {
  it('busca cada dificuldade e os duelos no Supabase', async () => {
    const { ranking, fetch } = await carregarOnline((url) =>
      url.includes('duelistas')
        ? [{ nome: 'Ana', vitorias: 2, partidas: 3 }]
        : url.includes('eq.facil')
          ? [{ id: 1, nome: 'Bia', jogadas: 8, segundos: 30 }]
          : [],
    )

    const resultado = await ranking.buscarRanking()

    expect(resultado.solo.facil.map((r) => r.nome)).toEqual(['Bia'])
    expect(resultado.solo.dificil).toEqual([])
    expect(resultado.duelos[0].nome).toBe('Ana')
    expect(fetch).toHaveBeenCalledTimes(4)
    const [, init] = fetch.mock.calls[0]
    expect(init?.headers).toEqual({ apikey: 'sb_publishable_teste' })
  })

  it('registra a partida solo pela função e devolve a posição', async () => {
    const { ranking, fetch } = await carregarOnline(() => ({ id: 42, posicao: 3 }))

    const classificacao = await ranking.registrarSolo('medio', { nome: 'Caio', jogadas: 14, segundos: 50 })

    expect(classificacao).toEqual({ id: 42, posicao: 3 })
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://teste.supabase.co/rest/v1/rpc/registrar_solo')
    expect(JSON.parse(String(init?.body))).toEqual({
      p_nome: 'Caio',
      p_dificuldade: 'medio',
      p_jogadas: 14,
      p_segundos: 50,
    })
  })
})
