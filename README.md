# Drex - Pool de Liquidez

## Setup Inicial
```shell
npm install
```

Fazer uma cópia do arquivo .env.example e criar o .env
```shell
cp .env.example .env
```

Editar o arquivo para as configurações do seu ambiente e carteiras a serem utilizadas, caso for apenas interagir com o pool é necessário somente configurar o RPC_URL com a url do RPC do besu e USER_WALLET_PK com a chave privada da carteira de usuário que irá executar as transações. 
```shell
RPC_URL=http://...
USER_WALLET_PK=<Chave privada da carteira que ira executar as transações>
```

Antes do primeiro uso, garanta que a carteira a ser utilizada esteja habilitada para DREX, contenha saldo para as operações e que os contratos do pool estejam autorizados (approve das moedas).

## Autorização
Para autorizar os contratos do pool de liquidez execute o comando:
```shell
npx hardhat run scripts/exec/poolUserPermissions.ts --network besu
```

## Adicionar liquidez no pool.
Garanta que a carteira tenha saldo maior ou igual aos valores desejados do par de moedas (TPFt e DREX).
Este pool utiliza o TPFt representado pelo id 2 do padrão ERC1155.
Antes de executar edite os valores no script.
Como esse é um pool de produto constante, e foi criado com um valor fixo de TPFt de R$ 16.325,48, novas adições de liquidez precisam ser feitas com a mesma proporção.
```shell
npx hardhat run scripts/exec/addLiquidity.ts --network besu
```

## Compra de TPFT
Garanta que a carteira tenha saldo maior ou igual ao valor desejado em DREX para compra de TPFt.
Antes de executar edite os valores no script.
```shell
npx hardhat run scripts/exec/swapDrexInTpftOut.ts --network besu
```

## Venda de TPFT
Garanta que a carteira tenha saldo maior ou igual ao valor desejado em TPFt para venda.
Este pool utiliza o TPFt representado pelo id 2 do padrão ERC1155.
Antes de executar edite os valores no script.
```shell
npx hardhat run scripts/exec/swapTpftInDrexOut.ts --network besu
```

# Remover liquidez
```shell
npx hardhat run scripts/exec/removeLiquidity.ts --network besu
```

### Exemplo de transações executadas na rede DREX

Exemplos das transações executadas na rede do drex de um mesmo usuário que adicionou inicialmente a liquidez de 50000 TPFt a um preço de R$ 16.325,48 cada TPFt, ou seja, o equivalente a R$ 816.274.000.

Adicionando liquidez

```shell
npx hardhat run scripts/exec/addLiquidity.ts --network besu
Saldo pool tokens: 0
Saldo Drex: 816274013.29
Saldo TPFt: 50008.35
Liquidez adicionada! Transação 0xe3f580e5be0d884c60c3c35a5d9eedd4303ac879ea0d53d7863b79350017075f
Saldo pool tokens: 638856008
Saldo Drex: 13.29
Saldo TPFt: 8.35
```

Venda de 8 TPFt

```shell
npx hardhat run scripts/exec/swapTpftInDrexOut.ts --network besu
Saldo pool tokens: 638856008
Saldo Drex: 13.29
Saldo TPFt: 8.35
Estimativa de retorno para compra de 8.0 tpft é de 130093.33 drex
Compra realizada! Transação 0x72ed54eac74d85b68e4cae3ac1f7f6154c8ec207f5e0bd416bd108d73d5dea1a
Saldo pool tokens: 638856008
Saldo Drex: 130106.62
Saldo TPFt: 0.35
```

Compra de TPFt com entrada de R$ 81.627,4

```shell
Saldo pool tokens: 638856008
Saldo Drex: 130106.62
Saldo TPFt: 0.35
Estimativa de retorno para compra de TPFt com R$ 81627.4 drex é de 4.98 TPFt
Compra realizada! Transação 0x0065b9d343d69549e4936ee035a6928365612bd4cca068e28ec264026d1670d2
Saldo pool tokens: 638856008
Saldo Drex: 48479.22
Saldo TPFt: 5.33
```

Remoção de liquidez de 10000 Pool tokens

```shell
npx hardhat run scripts/exec/removeLiquidity.ts --network besu
Saldo pool tokens: 638856008
Saldo Drex: 48479.22
Saldo TPFt: 5.33
Liquidez removida! Transação 0x8bc3f341ad7bc7c0f2106cfaaedbfee60a899ba8921f401abdb7365f06627a62
Saldo pool tokens: 638846008
Saldo Drex: 61255.58
Saldo TPFt: 6.11
```