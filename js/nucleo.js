// Thrackle convexo: cordas de um poligono que se encontram todas duas a duas.
//
// Um THRACKLE e um desenho de grafo em que cada par de arestas se encontra
// EXATAMENTE uma vez, ou numa ponta compartilhada ou num cruzamento. A
// conjectura de Conway, aberta desde 1960 e tantos, diz que um grafo com
// thrackle tem no maximo tantas arestas quanto vertices.
//
// Desenho qualquer e coisa continua e nao se varre. Mas ha um caso que se
// varre inteiro: os pontos em POSICAO CONVEXA, nos vertices de um poligono.
// Ali tudo vira combinatoria, porque duas cordas de um poligono convexo se
// encontram exatamente quando:
//
//   - compartilham uma ponta, ou
//   - as pontas se INTERCALAM na volta do poligono: a < c < b < d
//
// E so. Nao ha coordenada, nao ha epsilon, nao ha caso degenerado. Entao a
// pergunta "qual o maior conjunto de cordas que se encontram todas duas a
// duas?" e uma pergunta finita, e este projeto varre a resposta.
//
// Cada corda e o par {a, b} com a < b. Numero-as de 0 a C(n,2)-1.

/** Todas as cordas do poligono de n pontos, como pares [a,b] com a < b. */
export function cordas (n) {
  const saida = []
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) saida.push([a, b])
  }
  return saida
}

export function quantasCordas (n) {
  return n * (n - 1) / 2
}

/**
 * As duas cordas se encontram?
 *
 * Ponta em comum conta como encontro: num thrackle a regra e "se encontram
 * exatamente uma vez", e duas arestas com ponta comum ja se encontram ali.
 * Confundir isso com "se cruzam" tira do conjunto todas as estrelas, e a
 * estrela e justamente uma das duas construcoes que o projeto compara.
 */
export function seEncontram (c1, c2) {
  const [a, b] = c1
  const [c, d] = c2
  if (a === c && b === d) return false   // a mesma corda nao conta
  if (a === c || a === d || b === c || b === d) return true   // ponta comum
  return (a < c && c < b && b < d) || (c < a && a < d && d < b)  // intercalam
}

/**
 * O grafo de encontro: para cada corda, a mascara das que ela encontra.
 *
 * Com n = 12 sao 66 cordas, e 66 bits nao cabem num inteiro do JavaScript.
 * Uso BigInt a partir dali, e o construtor avisa qual dos dois esta em uso: um
 * numero que estoura em silencio nao da erro, da tabela errada.
 */
export const TETO_SEM_BIGINT = 30

export function grafoDeEncontro (n) {
  const cs = cordas(n)
  const m = cs.length
  const grande = m > TETO_SEM_BIGINT
  const vizinhos = new Array(m)
  for (let i = 0; i < m; i++) vizinhos[i] = grande ? 0n : 0
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      if (seEncontram(cs[i], cs[j])) {
        if (grande) {
          vizinhos[i] |= 1n << BigInt(j)
          vizinhos[j] |= 1n << BigInt(i)
        } else {
          vizinhos[i] |= 1 << j
          vizinhos[j] |= 1 << i
        }
      }
    }
  }
  return { n, cordas: cs, m, vizinhos, grande }
}

export function conta (m) {
  m = m - ((m >>> 1) & 0x55555555)
  m = (m & 0x33333333) + ((m >>> 2) & 0x33333333)
  m = (m + (m >>> 4)) & 0x0f0f0f0f
  return (m * 0x01010101) >>> 24
}

export function contaGrande (x) {
  let c = 0
  while (x) { x &= x - 1n; c++ }
  return c
}

/** O conjunto de cordas se encontra todo duas a duas? */
export function ehThrackle (g, indices) {
  for (let i = 0; i < indices.length; i++) {
    for (let j = i + 1; j < indices.length; j++) {
      if (!seEncontram(g.cordas[indices[i]], g.cordas[indices[j]])) return false
    }
  }
  return true
}

// ---------------------------------------------------------------------------
// As duas construcoes conhecidas. Nenhuma delas busca nada: sao receitas.
// ---------------------------------------------------------------------------

/**
 * A ESTRELA: todas as cordas que saem de um mesmo ponto.
 *
 * Sao n-1 cordas, e elas se encontram todas duas a duas na ponta comum. Vale
 * para qualquer n, par ou impar.
 */
export function estrela (n, centro = 0) {
  const cs = cordas(n)
  const saida = []
  for (let i = 0; i < cs.length; i++) {
    if (cs[i][0] === centro || cs[i][1] === centro) saida.push(i)
  }
  return saida
}

/**
 * O MUSQUASH do poligono impar: as n "diagonais longas".
 *
 * Com n impar, ligar cada ponto i ao ponto i + (n-1)/2 da n cordas, e cada duas
 * delas se cruzam. Sao n cordas, uma a mais que a estrela — e e por isso que o
 * caso impar e diferente do par.
 *
 * Com n par esta receita nao da n cordas: i e i + n/2 produz cada corda duas
 * vezes, e sobram n/2. Devolvo o que a receita produz, sem maquiar.
 */
export function diagonaisLongas (n) {
  const cs = cordas(n)
  const indice = new Map()
  for (let i = 0; i < cs.length; i++) indice.set(`${cs[i][0]}-${cs[i][1]}`, i)
  const salto = Math.floor(n / 2)
  const vistos = new Set()
  for (let i = 0; i < n; i++) {
    const j = (i + salto) % n
    const a = Math.min(i, j)
    const b = Math.max(i, j)
    vistos.add(indice.get(`${a}-${b}`))
  }
  return [...vistos].sort((x, y) => x - y)
}

/** Desenha o conjunto como lista de pares, para o teste falar claro. */
export function comoPares (g, indices) {
  return indices.map((i) => g.cordas[i])
}
