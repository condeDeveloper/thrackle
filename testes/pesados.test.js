// Os casos caros: a varredura literal de 2^21 subconjuntos e os poligonos
// grandes, em que a contagem de maximos passa de quatro mil.

import test from 'node:test'
import assert from 'node:assert/strict'

import { grafoDeEncontro } from '../js/nucleo.js'
import { matriz, maiorThrackle, contaMaximos } from '../js/busca.js'
import { forcaBruta, previsaoDeMaximos } from '../js/juiz.js'

test('n=7 pela varredura literal: 2.097.152 subconjuntos, 57 maximos', () => {
  const r = forcaBruta(7)
  assert.equal(r.completa, true)
  assert.equal(r.abertos, 2097152)
  assert.equal(r.maior, 7)
  assert.equal(r.quantos, 57)
})

test('n=13: 78 cordas, maximo 13, e 4.083 conjuntos maximos', () => {
  const g = grafoDeEncontro(13)
  assert.equal(g.m, 78)
  assert.equal(g.grande, true)
  const adj = matriz(g)
  const r = maiorThrackle(g, { adj })
  assert.equal(r.tamanho, 13)
  const c = contaMaximos(g, 13, { adj })
  assert.equal(c.quantos, 4083)
  assert.equal(c.quantos, previsaoDeMaximos(13))
})

test('n=14: a forma fechada continua de pe fora da faixa em que nasceu', () => {
  // A forma foi lida na coluna ate n=10. Esta linha e mais uma confirmacao
  // alem das tres que ja eram previsao.
  const g = grafoDeEncontro(14)
  assert.equal(g.m, 91)
  const adj = matriz(g)
  const r = maiorThrackle(g, { adj })
  assert.equal(r.tamanho, 14)
  const c = contaMaximos(g, 14, { adj })
  assert.equal(c.quantos, previsaoDeMaximos(14))
  assert.equal(c.quantos, 8178)
})

test('o exemplo do n=13 e mesmo um thrackle de 13 cordas', () => {
  const g = grafoDeEncontro(13)
  const r = maiorThrackle(g, { adj: matriz(g) })
  assert.equal(r.exemplo.length, 13)
  const cs = r.exemplo.map((i) => g.cordas[i])
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      const [a, b] = cs[i]
      const [c, d] = cs[j]
      const pontaComum = a === c || a === d || b === c || b === d
      const intercalam = (a < c && c < b && b < d) || (c < a && a < d && d < b)
      assert.ok(pontaComum || intercalam, `${cs[i]} e ${cs[j]} nao se encontram`)
    }
  }
})
