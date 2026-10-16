const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined
const CHAVE = import.meta.env.VITE_SUPABASE_KEY as string | undefined
const TEMPO_LIMITE = 8000

export const supabaseConfigurado = Boolean(URL_BASE && CHAVE)

async function pedir<T>(caminho: string, corpo?: unknown): Promise<T> {
  const resposta = await fetch(`${URL_BASE}/rest/v1/${caminho}`, {
    method: corpo === undefined ? 'GET' : 'POST',
    headers: {
      apikey: CHAVE!,
      // Chaves anon antigas são JWT e também vão no Authorization; as publishable novas, não.
      ...(CHAVE!.startsWith('eyJ') && { Authorization: `Bearer ${CHAVE}` }),
      ...(corpo !== undefined && { 'Content-Type': 'application/json' }),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(TEMPO_LIMITE),
  })
  if (!resposta.ok) throw new Error(`Supabase respondeu ${resposta.status}: ${await resposta.text()}`)
  const texto = await resposta.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

export const consultar = <T>(caminho: string) => pedir<T>(caminho)

export const chamar = <T>(funcao: string, argumentos: Record<string, unknown>) => pedir<T>(`rpc/${funcao}`, argumentos)
