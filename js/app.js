// A pagina: o poligono, as cordas e os conjuntos maximos desenhados.

import { grafoDeEncontro, cordas, estrela, diagonaisLongas, seEncontram } from './nucleo.js'
import { matriz, maiorThrackle, contaMaximos } from './busca.js'
import { previsaoDeMaximos } from './juiz.js'

const elN = document.getElementById('pontos')
const elDesenho = document.getElementById('desenho')
const elTexto = document.getElementById('texto')

let n = 8
let g = null
let adj = null
let conjunto = []
let maximos = []
let indice = 0

function monta () {
  n = Number(elN.value)
  g = grafoDeEncontro(n)
  adj = matriz(g)
  conjunto = maiorThrackle(g, { adj }).exemplo
  maximos = []
  indice = 0
  desenha(`Maior conjunto de cordas que se encontram todas duas a duas: <strong>${conjunto.length}</strong>, em ${n} pontos. O teto da conjectura de Conway é ${n}, e ele foi atingido.`)
}

function pontos () {
  const R = 150
  const cx = 190
  const cy = 180
  const saida = []
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n
    saida.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang)])
  }
  return saida
}

function desenha (nota) {
  const p = pontos()
  const partes = []
  const escolhidas = new Set(conjunto)

  // Primeiro as cordas de fora do conjunto, bem apagadas.
  g.cordas.forEach(([a, b], i) => {
    if (escolhidas.has(i)) return
    partes.push(`<line x1="${p[a][0].toFixed(1)}" y1="${p[a][1].toFixed(1)}" x2="${p[b][0].toFixed(1)}" y2="${p[b][1].toFixed(1)}" stroke="#332a47" stroke-width="1" opacity="0.5"/>`)
  })
  for (const i of conjunto) {
    const [a, b] = g.cordas[i]
    partes.push(`<line x1="${p[a][0].toFixed(1)}" y1="${p[a][1].toFixed(1)}" x2="${p[b][0].toFixed(1)}" y2="${p[b][1].toFixed(1)}" stroke="#a52a45" stroke-width="2.5" stroke-linecap="round"/>`)
  }
  for (let v = 0; v < n; v++) {
    partes.push(`<circle cx="${p[v][0].toFixed(1)}" cy="${p[v][1].toFixed(1)}" r="10" fill="#1d1729" stroke="#ece7f5" stroke-width="1.5"/>`)
    partes.push(`<text x="${p[v][0].toFixed(1)}" y="${(p[v][1] + 4).toFixed(1)}" text-anchor="middle" fill="#ece7f5" font-size="11">${v}</text>`)
  }
  elDesenho.innerHTML = `<svg viewBox="0 0 380 360" role="img" aria-label="poligono com as cordas do thrackle">${partes.join('')}</svg>`
  elTexto.innerHTML = `${nota} <br>Cordas em vinho: <code>${conjunto.map((i) => g.cordas[i].join('-')).join('  ')}</code>`
}

document.getElementById('maior').addEventListener('click', () => {
  conjunto = maiorThrackle(g, { adj }).exemplo
  desenha(`Um conjunto máximo, com <strong>${conjunto.length}</strong> cordas.`)
})

document.getElementById('estrela').addEventListener('click', () => {
  conjunto = estrela(n)
  desenha(`A <strong>estrela</strong>: todas as cordas que saem do ponto 0. São ${conjunto.length} = n−1, e elas se encontram todas na ponta comum. ` +
    (conjunto.length < n ? `Fica <strong>uma abaixo</strong> do máximo, que é ${n}.` : ''))
})

document.getElementById('diagonais').addEventListener('click', () => {
  conjunto = diagonaisLongas(n)
  const texto = n % 2 === 1
    ? `As <strong>diagonais longas</strong>: ligando cada ponto ao oposto. No ímpar são ${conjunto.length} = n, e elas <strong>alcançam</strong> o máximo.`
    : `As <strong>diagonais longas</strong>: no par a receita produz cada corda duas vezes e sobram ${conjunto.length} = n/2. Ela fica bem longe do máximo, que é ${n}.`
  desenha(texto)
})

document.getElementById('contar').addEventListener('click', () => {
  elTexto.textContent = 'contando...'
  setTimeout(() => {
    const antes = performance.now()
    const r = contaMaximos(g, n, { adj, guardarAte: 200 })
    const ms = Math.round(performance.now() - antes)
    maximos = r.exemplos
    indice = 0
    conjunto = maximos.length ? maximos[0] : conjunto
    desenha(`Existem <strong>${r.quantos.toLocaleString('pt-BR')}</strong> conjuntos máximos de ${n} cordas, contados em ${ms} ms. ` +
      `A forma fechada que a medida sugeriu, 2^(n−1) − n, dá <strong>${previsaoDeMaximos(n).toLocaleString('pt-BR')}</strong>. ` +
      `Clique em "próximo" para ver outros.`)
  }, 10)
})

document.getElementById('proximo').addEventListener('click', () => {
  if (maximos.length === 0) return
  indice = (indice + 1) % maximos.length
  conjunto = maximos[indice]
  desenha(`Conjunto máximo <strong>${indice + 1}</strong> dos ${maximos.length} guardados.`)
})

elN.addEventListener('change', monta)
monta()
