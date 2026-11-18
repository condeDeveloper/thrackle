// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { grafoDeEncontro, estrela, diagonaisLongas, quantasCordas } from './nucleo.js'
import { matriz, maiorThrackle, contaMaximos } from './busca.js'
import { forcaBruta, cotaDeConway, construcoes, previsaoDeMaximos, TETO_DA_BRUTA } from './juiz.js'

const guardadas = new Map()
function umaVez (chave, fn) {
  if (!guardadas.has(chave)) guardadas.set(chave, fn())
  return guardadas.get(chave)
}

export function grafo (n) {
  return umaVez(`g:${n}`, () => {
    const g = grafoDeEncontro(n)
    g.adj = matriz(g)
    return g
  })
}

export function maior (n) {
  return umaVez(`maior:${n}`, () => {
    const g = grafo(n)
    return maiorThrackle(g, { adj: g.adj })
  })
}

export function maximos (n) {
  return umaVez(`max:${n}`, () => {
    const g = grafo(n)
    return contaMaximos(g, maior(n).tamanho, { adj: g.adj })
  })
}

/** O maior thrackle convexo, por tamanho de poligono. */
export function tabelaDoMaximo (de = 3, ate = 12) {
  return umaVez(`tab:${de}:${ate}`, () => {
    const linhas = []
    for (let n = de; n <= ate; n++) {
      const r = maior(n)
      linhas.push({
        n,
        cordas: quantasCordas(n),
        maximo: r.tamanho,
        cotaDeConway: cotaDeConway(n),
        atingeOTeto: r.tamanho === cotaDeConway(n),
        nos: r.nos
      })
    }
    return linhas
  })
}

/**
 * Quantos conjuntos maximos existem, e a forma fechada que a medida sugeriu.
 *
 * A coluna `previsto` nao e teorema citado: e uma conjectura minha, lida na
 * propria coluna medida e escrita ANTES de medir n = 11, 12 e 13.
 */
export function tabelaDeMaximos (de = 3, ate = 13) {
  return umaVez(`maxtab:${de}:${ate}`, () => {
    const linhas = []
    for (let n = de; n <= ate; n++) {
      const q = maximos(n).quantos
      linhas.push({ n, maximo: maior(n).tamanho, quantos: q, previsto: previsaoDeMaximos(n), bate: q === previsaoDeMaximos(n) })
    }
    const diferencas = []
    for (let i = 1; i < linhas.length; i++) diferencas.push(linhas[i].quantos - linhas[i - 1].quantos)
    return { linhas, diferencas }
  })
}

/** As duas receitas fechadas contra o maximo medido. */
export function tabelaDasConstrucoes (de = 3, ate = 12) {
  return umaVez(`cons:${de}:${ate}`, () => {
    const linhas = []
    for (let n = de; n <= ate; n++) {
      const c = construcoes(n)
      const m = maior(n).tamanho
      linhas.push({
        n, maximo: m, estrela: c.estrela, diagonais: c.diagonais,
        estrelaValida: c.estrelaValida, diagonaisValidas: c.diagonaisValidas,
        melhorReceita: c.melhorConstrucao,
        falta: m - c.melhorConstrucao,
        par: n % 2 === 0
      })
    }
    return {
      linhas,
      paresQueFaltam: linhas.filter((l) => l.par && l.falta > 0).length,
      paresMedidos: linhas.filter((l) => l.par).length,
      imparesQueFaltam: linhas.filter((l) => !l.par && l.falta > 0).length,
      imparesMedidos: linhas.filter((l) => !l.par).length
    }
  })
}

/** A ramifica-e-poda contra a varredura de subconjuntos. */
export function duelo (ate = 7) {
  return umaVez(`duelo:${ate}`, () => {
    const linhas = []
    for (let n = 3; n <= ate; n++) {
      const g = grafo(n)
      const bom = maior(n)
      const c = maximos(n)
      const br = forcaBruta(n)
      linhas.push({
        n, cordas: g.m,
        maiorBom: bom.tamanho, maiorBruta: br.maior,
        quantosBom: c.quantos, quantosBruta: br.quantos,
        nosBom: bom.nos + c.nos,
        subconjuntos: br.completa ? br.abertos : null,
        completa: br.completa,
        concordam: br.completa ? (bom.tamanho === br.maior && c.quantos === br.quantos) : null,
        razao: br.completa ? br.abertos / (bom.nos + c.nos) : null
      })
    }
    return linhas
  })
}

export { TETO_DA_BRUTA, previsaoDeMaximos, estrela, diagonaisLongas }
