// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabelaDoMaximo, tabelaDeMaximos, tabelaDasConstrucoes, duelo } from '../js/medidas.js'

test('o maximo e n em todas as linhas, e ele atinge o teto de Conway', () => {
  const linhas = tabelaDoMaximo(3, 12)
  assert.equal(linhas.length, 10)
  for (const l of linhas) {
    assert.equal(l.maximo, l.n, `n=${l.n}`)
    assert.equal(l.atingeOTeto, true, `n=${l.n}`)
    assert.equal(l.maximo, l.cotaDeConway)
  }
})

test('a contagem de maximos, linha a linha', () => {
  const r = tabelaDeMaximos(3, 13)
  assert.deepEqual(r.linhas.map((l) => l.quantos),
    [1, 4, 11, 26, 57, 120, 247, 502, 1013, 2036, 4083])
})

test('as diferencas sao potencias de dois menos um', () => {
  const r = tabelaDeMaximos(3, 13)
  assert.deepEqual(r.diferencas, [3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047])
  for (let i = 0; i < r.diferencas.length; i++) {
    assert.equal(r.diferencas[i], Math.pow(2, i + 2) - 1)
  }
})

test('a forma fechada 2^(n-1) - n bate nas 11 linhas medidas', () => {
  const r = tabelaDeMaximos(3, 13)
  for (const l of r.linhas) {
    assert.equal(l.bate, true, `n=${l.n}: ${l.quantos} contra ${l.previsto}`)
    assert.equal(l.quantos, Math.pow(2, l.n - 1) - l.n)
  }
})

test('as tres linhas que eram PREVISAO quando a forma foi escrita', () => {
  // A forma fechada foi lida na coluna ate n=10 e escrita antes de medir 11,
  // 12 e 13. Estas tres linhas sao a aposta, e elas bateram.
  const r = tabelaDeMaximos(3, 13)
  const porN = new Map(r.linhas.map((l) => [l.n, l]))
  assert.equal(porN.get(11).quantos, 1013)
  assert.equal(porN.get(12).quantos, 2036)
  assert.equal(porN.get(13).quantos, 4083)
})

test('no impar alguma receita alcanca, no par nenhuma alcanca', () => {
  const r = tabelaDasConstrucoes(3, 12)
  assert.equal(r.imparesQueFaltam, 0, 'algum impar ficou sem receita que alcanca')
  assert.equal(r.paresQueFaltam, r.paresMedidos, 'algum par foi alcancado por receita')
  assert.equal(r.paresMedidos, 5)
  assert.equal(r.imparesMedidos, 5)
})

test('no par a melhor receita fica exatamente uma corda abaixo', () => {
  const r = tabelaDasConstrucoes(3, 12)
  for (const l of r.linhas.filter((x) => x.par)) {
    assert.equal(l.falta, 1, `n=${l.n}`)
    assert.equal(l.melhorReceita, l.n - 1)
    assert.equal(l.estrela, l.n - 1)
    assert.equal(l.diagonais, l.n / 2)
  }
})

test('as duas receitas sao thrackles validos em todas as linhas', () => {
  for (const l of tabelaDasConstrucoes(3, 12).linhas) {
    assert.equal(l.estrelaValida, true, `estrela n=${l.n}`)
    assert.equal(l.diagonaisValidas, true, `diagonais n=${l.n}`)
  }
})

test('a poda e a varredura literal concordam, e a razao cresce', () => {
  const linhas = duelo(7).filter((l) => l.completa)
  for (const l of linhas) assert.equal(l.concordam, true, `n=${l.n}`)
  for (let i = 1; i < linhas.length; i++) {
    assert.ok(linhas[i].razao > linhas[i - 1].razao, `n=${linhas[i].n}`)
  }
})

test('no n=7 a varredura literal paga 3.883x mais', () => {
  const l = duelo(7).find((x) => x.n === 7)
  assert.equal(l.cordas, 21)
  assert.equal(l.subconjuntos, 2097152)
  assert.equal(l.subconjuntos, Math.pow(2, 21))
  assert.equal(l.nosBom, 540)
  assert.equal(l.razao.toFixed(1), '3883.6')
  assert.equal(l.maiorBom, 7)
  assert.equal(l.quantosBom, 57)
})

test('o custo da busca cresce devagar perto do custo da bruta', () => {
  // A bruta dobra a cada corda nova; a poda nao.
  const linhas = duelo(7).filter((l) => l.completa)
  const primeiro = linhas[0]
  const ultimo = linhas[linhas.length - 1]
  const vezesBruta = ultimo.subconjuntos / primeiro.subconjuntos
  const vezesPoda = ultimo.nosBom / primeiro.nosBom
  assert.equal(vezesBruta, 262144)
  assert.equal(vezesPoda, 67.5)
  assert.ok(vezesBruta > vezesPoda * 1000)
})
