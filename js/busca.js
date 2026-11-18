// A varredura: o maior conjunto de cordas que se encontram todas duas a duas.
//
// Isso e clique maxima no grafo de encontro, e clique maxima e cara. A busca
// aqui e ramifica-e-poda com COTA POR COLORACAO: antes de entrar num ramo, pinto
// os candidatos de forma gulosa e, se o numero de cores nao chega para passar do
// melhor ja achado, o ramo inteiro cai. E a poda que separa "roda" de "termina".
//
// O estado de cada nivel e criado no proprio nivel. Vetor de trabalho
// compartilhado entre niveis e o erro que mais aparece neste acervo: compila,
// roda, e responde errado em silencio.

import { grafoDeEncontro, seEncontram, cordas, quantasCordas, estrela, diagonaisLongas } from './nucleo.js'

/** Matriz booleana de adjacencia: simples, e rapida o bastante ate 66 cordas. */
export function matriz (g) {
  const m = g.m
  const adj = Array.from({ length: m }, () => new Uint8Array(m))
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      if (seEncontram(g.cordas[i], g.cordas[j])) { adj[i][j] = 1; adj[j][i] = 1 }
    }
  }
  return adj
}

/**
 * A cota por coloracao gulosa.
 *
 * Pinto os candidatos um a um, cada um na primeira cor que nenhum vizinho ja
 * usou. Um conjunto que se encontra todo duas a duas nao pode ter duas cordas
 * da mesma cor, entao o numero de cores e um TETO para a clique que ainda cabe
 * neste ramo.
 */
export function cotaPorCor (adj, candidatos) {
  const corDe = new Map()
  let cores = 0
  for (const v of candidatos) {
    const usadas = new Set()
    for (const u of candidatos) {
      if (u !== v && adj[v][u] && corDe.has(u)) usadas.add(corDe.get(u))
    }
    let c = 0
    while (usadas.has(c)) c++
    corDe.set(v, c)
    if (c + 1 > cores) cores = c + 1
  }
  return cores
}

/**
 * A maior clique, com ramifica-e-poda.
 *
 * Devolve o tamanho, um exemplo e o numero de nos abertos — o custo e tabela,
 * nao detalhe: e com ele que se mede o que a poda vale.
 */
export function maiorThrackle (g, opcoes = {}) {
  const adj = opcoes.adj || matriz(g)
  const m = g.m
  let melhor = 0
  let exemplo = []
  let nos = 0

  const expande = (atual, candidatos) => {
    nos++
    if (candidatos.length === 0) {
      if (atual.length > melhor) { melhor = atual.length; exemplo = [...atual] }
      return
    }
    if (atual.length + candidatos.length <= melhor) return
    if (atual.length + cotaPorCor(adj, candidatos) <= melhor) return

    // Ordeno por grau dentro do candidato: o mais conectado primeiro faz a
    // melhor solucao aparecer cedo, e e ela que poda o resto.
    const ordenados = [...candidatos].sort((a, b) => {
      let ga = 0, gb = 0
      for (const u of candidatos) { if (adj[a][u]) ga++; if (adj[b][u]) gb++ }
      return gb - ga
    })

    for (let k = 0; k < ordenados.length; k++) {
      const v = ordenados[k]
      if (atual.length + (ordenados.length - k) <= melhor) return
      const resto = ordenados.slice(k + 1).filter((u) => adj[v][u])
      expande([...atual, v], resto)
    }
  }

  const todos = []
  for (let i = 0; i < m; i++) todos.push(i)
  expande([], todos)
  return { tamanho: melhor, exemplo, nos }
}

/**
 * Quantos conjuntos de tamanho maximo existem.
 *
 * Aqui nao da para podar com "<=": preciso de TODOS os empates, entao a poda
 * so corta o que nao alcanca o maximo ja conhecido. Por isso esta funcao custa
 * mais que a anterior, e a tabela mostra as duas.
 */
export function contaMaximos (g, alvo, opcoes = {}) {
  const adj = opcoes.adj || matriz(g)
  const m = g.m
  let achados = 0
  let nos = 0
  const exemplos = []
  const guardarAte = opcoes.guardarAte === undefined ? 4 : opcoes.guardarAte

  const expande = (atual, candidatos, comeco) => {
    nos++
    if (atual.length === alvo) {
      achados++
      if (exemplos.length < guardarAte) exemplos.push([...atual])
      return
    }
    if (atual.length + candidatos.length < alvo) return
    for (let k = 0; k < candidatos.length; k++) {
      const v = candidatos[k]
      if (v < comeco) continue
      if (atual.length + (candidatos.length - k) < alvo) return
      const resto = candidatos.slice(k + 1).filter((u) => adj[v][u])
      expande([...atual, v], resto, v + 1)
    }
  }

  const todos = []
  for (let i = 0; i < m; i++) todos.push(i)
  expande([], todos, 0)
  return { quantos: achados, nos, exemplos }
}

/** A varredura de uma faixa de poligonos. */
export function varreFaixa (de, ate) {
  const linhas = []
  for (let n = de; n <= ate; n++) {
    const g = grafoDeEncontro(n)
    const adj = matriz(g)
    const r = maiorThrackle(g, { adj })
    linhas.push({
      n,
      cordas: g.m,
      maior: r.tamanho,
      nos: r.nos,
      exemplo: r.exemplo.map((i) => g.cordas[i]),
      estrela: estrela(n).length,
      diagonais: diagonaisLongas(n).length
    })
  }
  return linhas
}

/** Quantos maximos cada poligono tem. */
export function maximosDaFaixa (de, ate) {
  const linhas = []
  for (let n = de; n <= ate; n++) {
    const g = grafoDeEncontro(n)
    const adj = matriz(g)
    const r = maiorThrackle(g, { adj })
    const c = contaMaximos(g, r.tamanho, { adj })
    linhas.push({ n, cordas: g.m, maior: r.tamanho, quantos: c.quantos, nos: c.nos })
  }
  return linhas
}

export { grafoDeEncontro, cordas, quantasCordas, estrela, diagonaisLongas }
