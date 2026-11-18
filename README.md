# Thrackle convexo

Thrackles em posição convexa, varridos por polígono inteiro, em JavaScript puro, sem dependência nenhuma.

Um **thrackle** é um desenho de grafo em que cada par de arestas se encontra exatamente uma vez: ou numa ponta compartilhada, ou num cruzamento. A conjectura de Conway, aberta desde os anos 1960, diz que um grafo com thrackle tem no máximo tantas arestas quanto vértices.

Desenho qualquer é coisa contínua e não se varre. Mas há um caso que se varre inteiro: os pontos em **posição convexa**. Ali duas cordas se encontram exatamente quando compartilham uma ponta ou quando as pontas se intercalam na volta do polígono — `a < c < b < d`. Sem coordenada, sem epsilon, sem caso degenerado.

**Página:** <https://condedeveloper.github.io/thrackle/>

---

## Os quatro achados

**1. O teto de Conway não é só respeitado: ele é atingido.** Varrido de 3 a 12 pontos, o maior conjunto de cordas que se encontram todas duas a duas é **exatamente n**, em todas as linhas, no ímpar e no par.

**2. Nenhuma das duas receitas conhecidas alcança o máximo no caso par.** A estrela dá sempre `n−1`. As diagonais longas dão `n` no ímpar, mas só `n/2` no par, porque a receita produz cada corda duas vezes. Nos cinco polígonos pares medidos a melhor receita fica **exatamente uma corda abaixo** do máximo que a busca acha.

**3. O número de conjuntos máximos é `2^(n−1) − n`.** A coluna medida de 3 a 10 dá 1, 4, 11, 26, 57, 120, 247, 502, com diferenças **3, 7, 15, 31, 63, 127, 255** — potências de dois menos um. A forma foi escrita antes de medir n = 11, 12 e 13, e as três previsões bateram: **1.013**, **2.036**, **4.083**. O n = 14 também: **8.178**. Isto é conjectura minha, medida até aqui, e não teorema citado.

**4. A poda paga quase quatro mil vezes menos.** No n = 7 a ramifica-e-poda com cota por coloração abre **540** nós; a varredura literal abre **2.097.152** subconjuntos. São **3.883,6×**, e as duas dão a mesma resposta em tamanho e em contagem.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

### O maior thrackle convexo

| pontos | cordas | máximo | teto de Conway | |
| --- | --- | --- | --- | --- |
| 3 | 3 | 3 | 3 | atinge |
| 4 | 6 | 4 | 4 | atinge |
| 5 | 10 | 5 | 5 | atinge |
| 6 | 15 | 6 | 6 | atinge |
| 7 | 21 | 7 | 7 | atinge |
| 8 | 28 | 8 | 8 | atinge |
| 9 | 36 | 9 | 9 | atinge |
| 10 | 45 | 10 | 10 | atinge |
| 11 | 55 | 11 | 11 | atinge |
| 12 | 66 | 12 | 12 | atinge |

### Quantos conjuntos máximos existem

| n | máximos | `2^(n−1) − n` | diferença para a linha acima |
| --- | --- | --- | --- |
| 3 | 1 | 1 | – |
| 4 | 4 | 4 | 3 |
| 5 | 11 | 11 | 7 |
| 6 | 26 | 26 | 15 |
| 7 | 57 | 57 | 31 |
| 8 | 120 | 120 | 63 |
| 9 | 247 | 247 | 127 |
| 10 | 502 | 502 | 255 |
| 11 | **1.013** | 1.013 | 511 |
| 12 | **2.036** | 2.036 | 1.023 |
| 13 | **4.083** | 4.083 | 2.047 |

As três linhas em negrito eram **previsão** quando a fórmula foi escrita.

### As duas receitas contra o máximo

| n | | máximo | estrela | diagonais longas | melhor receita | |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | par | 4 | 3 | 2 | 3 | falta 1 |
| 5 | ímpar | 5 | 4 | **5** | 5 | alcança |
| 6 | par | 6 | 5 | 3 | 5 | falta 1 |
| 7 | ímpar | 7 | 6 | **7** | 7 | alcança |
| 8 | par | 8 | 7 | 4 | 7 | falta 1 |
| 9 | ímpar | 9 | 8 | **9** | 9 | alcança |
| 10 | par | 10 | 9 | 5 | 9 | falta 1 |
| 11 | ímpar | 11 | 10 | **11** | 11 | alcança |
| 12 | par | 12 | 11 | 6 | 11 | falta 1 |

Cinco ímpares de cinco alcançam. Cinco pares de cinco **não** alcançam, e sempre por exatamente uma corda.

### A poda contra a varredura literal

| n | cordas | nós da poda | subconjuntos | razão | |
| --- | --- | --- | --- | --- | --- |
| 3 | 3 | 8 | 8 | 1,0× | concordam |
| 4 | 6 | 24 | 64 | 2,7× | concordam |
| 5 | 10 | 71 | 1.024 | 14,4× | concordam |
| 6 | 15 | 198 | 32.768 | 165,5× | concordam |
| 7 | 21 | 540 | 2.097.152 | **3.883,6×** | concordam |

Do n=3 ao n=7 a varredura literal multiplica por 262.144 e a poda multiplica por 67,5.

---

## Os três juízes

**A varredura literal** abre os `2^cordas` subconjuntos e testa cada um par a par, sem poda, sem cota por cor, sem ordenação. Vai até 7 pontos e a tabela diz isso, em vez de fingir que conferiu tudo.

**O teto de Conway** é uma afirmação vinda de fora do programa. A varredura tem de respeitá-la, e respeita nas dez linhas — atingindo, que é afirmação mais forte do que respeitar.

**As duas construções** são receitas fechadas que não buscam nada e dão cotas inferiores. O interessante é onde elas ficam abaixo.

E o juiz tem **controle negativo**: dadas duas cordas disjuntas, ele reprova. Juiz que aprova tudo não é juiz, e há um teste que monta exatamente essa armadilha.

---

## O que as medidas me corrigiram

**Escrevi a fórmula antes de medir, e dessa vez acertei.** A coluna de máximos tinha cara de padrão aos n = 9, 10, e eu anotei `2^(n−1) − n` antes de rodar os três seguintes. As três bateram, e depois o n = 14 também. Apostar por escrito antes da medida é o que transforma tanto o acerto quanto o erro em conteúdo — e nos lotes anteriores deste acervo o resultado foi o contrário três vezes seguidas.

**Achei que a estrela fosse o máximo.** Ela é a construção óbvia, todas as cordas num ponto só, e dá `n−1`. Passei um bom tempo convencido de que o teto de Conway era frouxo por um. É o contrário: o teto é atingido, e a estrela é que fica curta.

**Confundi "se encontram" com "se cruzam".** Na primeira versão `seEncontram` só testava a intercalação. Com isso a estrela inteira sumia do grafo — cordas com ponta comum não se cruzam, mas se encontram, e num thrackle isso basta. O máximo caía pela metade e a tabela ficava plausível. Foi a comparação com a construção que pegou.

**Deixei a máscara estourar sem avisar.** Com 12 pontos são 66 cordas, e 66 bits não cabem num inteiro do JavaScript. A primeira versão fazia as contas de bits assim mesmo e devolvia número menor, em silêncio. Agora o grafo declara qual representação está em uso, e o ponto da troca está preso em teste.

**A receita das diagonais longas não se comporta no par.** Eu ia escrever "n diagonais longas" para todo n. No par ela produz cada corda duas vezes e sobram n/2. Em vez de maquiar o número, a função devolve o que a receita produz — e foi isso que virou metade do segundo achado.

---

## Como rodar

Node 20 ou mais novo. Sem dependência.

```bash
npm test                                  # a suite inteira
npm run medir                             # todas as tabelas
node ferramentas/medidor.js maximos       # a contagem e a forma fechada
node ferramentas/medidor.js construcoes   # as duas receitas contra o maximo
```

## Os arquivos

- `js/nucleo.js` — cordas, a regra de encontro e as duas construções.
- `js/busca.js` — a ramifica-e-poda com cota por coloração, e a contagem de máximos.
- `js/juiz.js` — a varredura literal, o teto de Conway e o controle negativo.
- `js/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `js/app.js` — a página, com o polígono desenhado.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 36 testes, com os números do README presos.

## Licença

MIT.
