// O juiz. Tres caminhos que nao passam pela ramifica-e-poda.
//
// 1. `forcaBruta` — varre os 2^cordas subconjuntos e testa cada um pela
//    definicao, par a par. E a resposta literal, sem poda, sem cota por cor,
//    sem ordenacao. Com 21 cordas sao 2.097.152 subconjuntos, entao ele para no
//    n = 7 — e a tabela diz isso, em vez de fingir que conferiu tudo.
//
// 2. `cotaDeConway` — a conjectura de Conway diz que um grafo com thrackle tem
//    no maximo tantas arestas quanto vertices. No caso convexo isso vira um
//    teto de n cordas, e a varredura tem de respeitar. Ela respeita, e em todas
//    as linhas ela ATINGE o teto, o que e uma afirmacao mais forte.
//
// 3. `construcoes` — duas receitas fechadas que nao buscam nada: a estrela e as
//    diagonais longas. Elas dao cotas INFERIORES, e o interessante e onde elas
//    ficam abaixo do maximo medido.

import { cordas, seEncontram, ehThrackle, estrela, diagonaisLongas, quantasCordas } from './nucleo.js'

export const TETO_DA_BRUTA = 21

/**
 * Todos os thrackles por varredura de subconjuntos.
 *
 * Devolve o maior tamanho e quantos conjuntos o atingem, como a busca boa — e
 * por caminho totalmente diferente.
 */
export function forcaBruta (n) {
  const cs = cordas(n)
  const m = cs.length
  if (m > TETO_DA_BRUTA) {
    return { n, completa: false, precisaria: Math.pow(2, m), maior: null, quantos: null }
  }
  const total = 1 << m
  let maior = 0
  let quantos = 0
  for (let mask = 1; mask < total; mask++) {
    const indices = []
    for (let i = 0; i < m; i++) if (mask & (1 << i)) indices.push(i)
    if (indices.length < maior) continue
    let ok = true
    for (let i = 0; i < indices.length && ok; i++) {
      for (let j = i + 1; j < indices.length; j++) {
        if (!seEncontram(cs[indices[i]], cs[indices[j]])) { ok = false; break }
      }
    }
    if (!ok) continue
    if (indices.length > maior) { maior = indices.length; quantos = 1 }
    else if (indices.length === maior) quantos++
  }
  return { n, completa: true, abertos: total, maior, quantos }
}

/** O teto da conjectura de Conway no caso convexo: n cordas. */
export function cotaDeConway (n) {
  return n
}

/** As duas construcoes fechadas, com o que cada uma entrega. */
export function construcoes (n) {
  const e = estrela(n)
  const d = diagonaisLongas(n)
  return {
    n,
    estrela: e.length,
    diagonais: d.length,
    // As duas sao thrackles de verdade? Conferido, nao suposto.
    estrelaValida: ehThrackle({ cordas: cordas(n) }, e),
    diagonaisValidas: ehThrackle({ cordas: cordas(n) }, d),
    melhorConstrucao: Math.max(e.length, d.length)
  }
}

/**
 * A forma fechada que a MEDIDA sugeriu para o numero de maximos.
 *
 * Isto NAO e teorema citado: e um padrao que apareceu na coluna medida de
 * n = 3 a 10 (1, 4, 11, 26, 57, 120, 247, 502, com diferencas 3, 7, 15, 31,
 * 63, 127, 255 — potencias de dois menos um) e que foi escrito ANTES de medir
 * n = 11, 12 e 13. As tres previsoes bateram. Continua sendo conjectura minha,
 * e o README diz isso com essas palavras.
 */
export function previsaoDeMaximos (n) {
  return Math.pow(2, n - 1) - n
}

/** Confere que um conjunto e mesmo thrackle, par a par, sem usar a matriz. */
export function confereParAPar (n, indices) {
  const cs = cordas(n)
  for (let i = 0; i < indices.length; i++) {
    for (let j = i + 1; j < indices.length; j++) {
      if (!seEncontram(cs[indices[i]], cs[indices[j]])) {
        return { ok: false, culpadas: [cs[indices[i]], cs[indices[j]]] }
      }
    }
  }
  return { ok: true }
}

/**
 * Controle negativo: um conjunto que NAO e thrackle tem de ser reprovado.
 *
 * Duas cordas disjuntas (sem ponta comum e sem intercalar) existem em todo
 * poligono de 4 pontos ou mais, e o juiz precisa acusa-las. Juiz que aprova
 * tudo nao e juiz.
 */
export function duasDisjuntas (n) {
  const cs = cordas(n)
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      if (!seEncontram(cs[i], cs[j])) return [i, j]
    }
  }
  return null
}

export { ehThrackle, quantasCordas }
