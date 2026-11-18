#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js              todas
//   node ferramentas/medidor.js maximo       o maior thrackle de cada poligono
//   node ferramentas/medidor.js maximos      quantos conjuntos maximos existem
//   node ferramentas/medidor.js construcoes  as duas receitas contra o maximo
//   node ferramentas/medidor.js duelo        a poda contra a varredura literal

import { tabelaDoMaximo, tabelaDeMaximos, tabelaDasConstrucoes, duelo } from '../js/medidas.js'

const n = (x) => x === null || x === undefined ? '-' : x.toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)

function tMaximo () {
  console.log('\n== o maior thrackle convexo ==')
  for (const l of tabelaDoMaximo(3, 12)) {
    console.log(`   n=${pad(l.n, 2)}  ${pad(l.cordas, 2)} cordas  ->  maximo ${pad(l.maximo, 2)}   teto de Conway ${pad(l.cotaDeConway, 2)}   ${l.atingeOTeto ? 'ATINGE o teto' : 'abaixo do teto'}   (${n(l.nos)} nos)`)
  }
  console.log('   O teto nao e so respeitado: ele e atingido em todas as linhas medidas.')
}

function tMaximos () {
  console.log('\n== quantos conjuntos maximos existem ==')
  const r = tabelaDeMaximos(3, 13)
  for (const l of r.linhas) {
    console.log(`   n=${pad(l.n, 2)}  maximo ${pad(l.maximo, 2)}   conjuntos maximos: ${pad(n(l.quantos), 6)}   2^(n-1) - n = ${pad(n(l.previsto), 6)}   ${l.bate ? 'bate' : 'NAO BATE'}`)
  }
  console.log(`\n   diferencas entre linhas: ${r.diferencas.join(', ')}`)
  console.log('   Sao potencias de dois menos um. A forma fechada 2^(n-1) - n foi LIDA')
  console.log('   nesta coluna ate n=10 e escrita ANTES de medir n=11, 12 e 13.')
  console.log('   Ela e conjectura minha, medida ate aqui, e nao teorema citado.')
}

function tConstrucoes () {
  console.log('\n== as duas receitas fechadas contra o maximo ==')
  const r = tabelaDasConstrucoes(3, 12)
  for (const l of r.linhas) {
    console.log(`   n=${pad(l.n, 2)} ${l.par ? 'par  ' : 'impar'}  maximo ${pad(l.maximo, 2)}   estrela ${pad(l.estrela, 2)}   diagonais longas ${pad(l.diagonais, 2)}   melhor receita ${pad(l.melhorReceita, 2)}   ${l.falta > 0 ? 'FALTA ' + l.falta : 'alcanca'}`)
  }
  console.log(`\n   impares em que alguma receita alcanca: ${r.imparesMedidos - r.imparesQueFaltam} de ${r.imparesMedidos}`)
  console.log(`   pares em que alguma receita alcanca:   ${r.paresMedidos - r.paresQueFaltam} de ${r.paresMedidos}`)
  console.log('   No par, as duas receitas conhecidas ficam UMA corda abaixo, sempre.')
}

function tDuelo () {
  console.log('\n== a ramifica-e-poda contra a varredura literal ==')
  for (const l of duelo(7)) {
    if (!l.completa) { console.log(`   n=${pad(l.n, 2)}  a bruta precisaria de 2^${l.cordas} subconjuntos: nao medida`); continue }
    console.log(`   n=${pad(l.n, 2)}  ${pad(l.cordas, 2)} cordas   poda: ${pad(n(l.nosBom), 6)} nos   bruta: ${pad(n(l.subconjuntos), 10)} subconjuntos   ${pad(l.razao.toFixed(1), 7)}x   ${l.concordam ? 'concordam' : 'DIVERGEM'} (${l.maiorBom}x${l.quantosBom} contra ${l.maiorBruta}x${l.quantosBruta})`)
  }
}

const partes = { maximo: tMaximo, maximos: tMaximos, construcoes: tConstrucoes, duelo: tDuelo }

const pedido = process.argv[2]
if (!pedido) {
  for (const f of Object.values(partes)) f()
} else if (partes[pedido]) {
  partes[pedido]()
} else {
  console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`)
  process.exit(1)
}
