const PREFIXO = 'jogo-da-memoria:'

export function ler<T>(chave: string, padrao: T): T {
  try {
    const valor = localStorage.getItem(PREFIXO + chave)
    return valor === null ? padrao : (JSON.parse(valor) as T)
  } catch {
    return padrao
  }
}

export function salvar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
  } catch {
    // Sem localStorage (aba anônima, cota cheia), o dado vale só para esta sessão.
  }
}
