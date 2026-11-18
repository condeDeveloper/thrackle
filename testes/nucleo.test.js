import test from 'node:test'
import assert from 'node:assert/strict'

import {
  cordas, quantasCordas, seEncontram, grafoDeEncontro, ehThrackle,
  estrela, diagonaisLongas, conta, TETO_SEM_BIGINT
} from '../js/nucleo.js'
import { matriz, maiorThrackle, contaMaximos, cotaPorCor } from '../js/busca.js'
import {
  forcaBruta, cotaDeConway, construcoes, previsaoDeMaximos,
  confereParAPar, duasDisjuntas, TETO_DA_BRUTA
} from '../js/juiz.js'

test('o numero de cordas e C(n,2)', () => {
  for (const n of [3, 5, 8, 12]) {
    assert.equal(cordas(n).length, quantasCordas(n))
    assert.equal(cordas(n).length, n * (n - 1) / 2)
  }
})

test('ponta compartilhada conta como encontro', () => {
  // Num thrackle a regra e "se encontram exatamente uma vez", e duas arestas
  // com ponta comum ja se encontram ali. Confundir isso com "se cruzam" tira
  // todas as estrelas do conjunto.
  assert.equal(seEncontram([0, 2], [0, 3]), true)
  assert.equal(seEncontram([1, 4], [2, 4]), true)
})

test('cordas que se intercalam se encontram, aninhadas e soltas nao', () => {
  assert.equal(seEncontram([0, 2], [1, 3]), true)   // 0 < 1 < 2 < 3
  assert.equal(seEncontram([0, 3], [1, 2]), false)  // aninhadas
  assert.equal(seEncontram([0, 1], [2, 3]), false)  // soltas
})

test('a mesma corda nao se encontra consigo mesma', () => {
  assert.equal(seEncontram([1, 4], [1, 4]), false)
})

test('todo poligono de 4 pontos ou mais tem duas cordas disjuntas', () => {
  for (const n of [4, 5, 8]) {
    const par = duasDisjuntas(n)
    assert.ok(par !== null, `n=${n}`)
    const cs = cordas(n)
    assert.equal(seEncontram(cs[par[0]], cs[par[1]]), false)
  }
  // No triangulo nao ha: as 3 cordas compartilham pontas duas a duas.
  assert.equal(duasDisjuntas(3), null)
})

test('o juiz par a par reprova um conjunto que nao e thrackle', () => {
  // Juiz que aprova tudo nao e juiz.
  const par = duasDisjuntas(6)
  const r = confereParAPar(6, par)
  assert.equal(r.ok, false)
  assert.equal(r.culpadas.length, 2)
})

test('a estrela e um thrackle, e tem n-1 cordas', () => {
  for (const n of [4, 6, 9, 12]) {
    const e = estrela(n)
    assert.equal(e.length, n - 1)
    assert.equal(confereParAPar(n, e).ok, true, `n=${n}`)
  }
})

test('as diagonais longas sao n no impar e n/2 no par', () => {
  for (const n of [5, 7, 9, 11]) assert.equal(diagonaisLongas(n).length, n, `impar n=${n}`)
  for (const n of [4, 6, 8, 10, 12]) assert.equal(diagonaisLongas(n).length, n / 2, `par n=${n}`)
  // E as duas versoes sao thrackles de verdade.
  for (const n of [5, 6, 7, 8]) assert.equal(confereParAPar(n, diagonaisLongas(n)).ok, true, `n=${n}`)
})

test('o grafo de encontro troca para BigInt quando passa de 30 cordas', () => {
  assert.equal(TETO_SEM_BIGINT, 30)
  assert.equal(grafoDeEncontro(8).grande, false)   // 28 cordas
  assert.equal(grafoDeEncontro(9).grande, true)    // 36 cordas
})

test('a cota por cor nunca fica abaixo da clique que existe no ramo', () => {
  const g = grafoDeEncontro(7)
  const adj = matriz(g)
  const todos = []
  for (let i = 0; i < g.m; i++) todos.push(i)
  const r = maiorThrackle(g, { adj })
  assert.ok(cotaPorCor(adj, todos) >= r.tamanho)
})

test('o maior thrackle convexo e exatamente n, de 3 a 10', () => {
  for (let n = 3; n <= 10; n++) {
    const g = grafoDeEncontro(n)
    assert.equal(maiorThrackle(g, { adj: matriz(g) }).tamanho, n, `n=${n}`)
  }
})

test('o maximo atinge o teto de Conway, e nunca passa dele', () => {
  for (let n = 3; n <= 10; n++) {
    const g = grafoDeEncontro(n)
    const r = maiorThrackle(g, { adj: matriz(g) })
    assert.ok(r.tamanho <= cotaDeConway(n), `n=${n} passou do teto`)
    assert.equal(r.tamanho, cotaDeConway(n), `n=${n} nao atingiu`)
  }
})

test('o exemplo que a busca devolve e mesmo um thrackle', () => {
  for (let n = 4; n <= 10; n++) {
    const g = grafoDeEncontro(n)
    const r = maiorThrackle(g, { adj: matriz(g) })
    assert.equal(confereParAPar(n, r.exemplo).ok, true, `n=${n}`)
    assert.equal(r.exemplo.length, n)
  }
})

test('no par, nenhuma das duas receitas alcanca o maximo', () => {
  for (const n of [4, 6, 8, 10, 12]) {
    const c = construcoes(n)
    const g = grafoDeEncontro(n)
    const maximo = maiorThrackle(g, { adj: matriz(g) }).tamanho
    assert.equal(maximo, n)
    assert.equal(c.melhorConstrucao, n - 1, `n=${n}`)
    assert.ok(c.melhorConstrucao < maximo, `n=${n}`)
  }
})

test('no impar as diagonais longas alcancam o maximo', () => {
  for (const n of [5, 7, 9, 11]) {
    const c = construcoes(n)
    const g = grafoDeEncontro(n)
    assert.equal(c.diagonais, maiorThrackle(g, { adj: matriz(g) }).tamanho, `n=${n}`)
  }
})

test('a ramifica-e-poda e a varredura literal concordam ate n=7', () => {
  assert.equal(TETO_DA_BRUTA, 21)
  for (let n = 3; n <= 6; n++) {
    const g = grafoDeEncontro(n)
    const adj = matriz(g)
    const bom = maiorThrackle(g, { adj })
    const c = contaMaximos(g, bom.tamanho, { adj })
    const br = forcaBruta(n)
    assert.equal(br.completa, true)
    assert.equal(bom.tamanho, br.maior, `n=${n} tamanho`)
    assert.equal(c.quantos, br.quantos, `n=${n} contagem`)
  }
})

test('a forca bruta se cala quando nao alcanca', () => {
  const r = forcaBruta(8)   // 28 cordas, passa do teto de 21
  assert.equal(r.completa, false)
  assert.equal(r.maior, null)
  assert.equal(r.quantos, null)
})

test('a forma fechada dos maximos bate de n=3 a n=10', () => {
  const esperado = [1, 4, 11, 26, 57, 120, 247, 502]
  for (let n = 3; n <= 10; n++) {
    const g = grafoDeEncontro(n)
    const adj = matriz(g)
    const alvo = maiorThrackle(g, { adj }).tamanho
    const q = contaMaximos(g, alvo, { adj }).quantos
    assert.equal(q, esperado[n - 3], `n=${n}`)
    assert.equal(q, previsaoDeMaximos(n), `n=${n} contra a forma fechada`)
  }
})

test('as diferencas da coluna sao potencias de dois menos um', () => {
  const vals = [1, 4, 11, 26, 57, 120, 247, 502]
  const dif = []
  for (let i = 1; i < vals.length; i++) dif.push(vals[i] - vals[i - 1])
  assert.deepEqual(dif, [3, 7, 15, 31, 63, 127, 255])
  for (let i = 0; i < dif.length; i++) assert.equal(dif[i], Math.pow(2, i + 2) - 1)
})

test('contar bits bate com a contagem no braco', () => {
  for (const x of [0, 1, 7, 255, 0b1010101]) {
    let c = 0
    for (let i = 0; i < 31; i++) if (x & (1 << i)) c++
    assert.equal(conta(x), c)
  }
})

test('ehThrackle concorda com a conferencia par a par', () => {
  const n = 7
  const g = grafoDeEncontro(n)
  const r = maiorThrackle(g, { adj: matriz(g) })
  assert.equal(ehThrackle(g, r.exemplo), true)
  assert.equal(ehThrackle(g, duasDisjuntas(n)), false)
})
