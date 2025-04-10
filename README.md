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
Garanta que a carteira tenha saldo maior ou igual ao valor de desejado em TPFt para venda.
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

```shell
npx hardhat run scripts/exec/addLiquidity.ts --network besu
Total shares antes: 0n
AddLiquidity realizado! Transação 0x87ce490292a3b173962ad1d3980f125cc744b9de4e978165d4b1a8a6f9ae3df2
Total shares depois: 250n
```

```shell
npx hardhat run scripts/exec/swapDrexInTpftOut.ts --network besu
Saldo Drex antes: 500n
Saldo TPFt antes: 0n
Estimativa de retorno para 10 drex com input:  8n
Swap realizado! Transação 0x44d111ddbb25f1f77c3dff866da22f3b640a2198e9d853497ebd3bd1e4fcbff3
Saldo Drex depois: 490n
Saldo TPFt depois: 8n
```

```shell
npx hardhat run scripts/exec/swapTpftInDrexOut.ts --network besu
Saldo Drex antes: 990n
Saldo TPFt antes: 508n
Estimativa de retorno para 10 tpft:  8n
Swap realizado! Transação 0xdf4ac2ecb90766887be8b8e50a95b973c74e2628a9b44ed00a3fe7514d7007bb
Saldo Drex depois: 998n
Saldo TPFt depois: 498n
```

```shell
npx hardhat run scripts/exec/removeLiquidity.ts --network besu
Total shares antes: 250n
Remove Liquidity realizado! Transação 0xa194d63caa3fed5d5481b86c434c852299e577ac673c2cda7581e269914128f4
Total shares depois: 0n
```

Exemplos das transações executadas na rede do drex de um mesmo usuário que adicionou inicialmente a liquidez de 50000 TPFt a um preço de R$ 16.325,48 cada TPFt, ou seja, o equivalente a R$ 816.274.000.

Adicionando liquidez

npx hardhat run scripts/exec/addLiquidity.ts --network besu
Saldo pool tokens: 0
Saldo Drex: 816274013.29
Saldo TPFt: 50008.35
Liquidez adicionada! Transação 0xe3f580e5be0d884c60c3c35a5d9eedd4303ac879ea0d53d7863b79350017075f
Saldo pool tokens: 638856008
Saldo Drex: 13.29
Saldo TPFt: 8.35

Venda de 8 TPFt

npx hardhat run scripts/exec/swapTpftInDrexOut.ts --network besu
Saldo pool tokens: 638856008
Saldo Drex: 13.29
Saldo TPFt: 8.35
Estimativa de retorno para compra de 8.0 tpft é de 130093.33 drex
Compra realizada! Transação 0x72ed54eac74d85b68e4cae3ac1f7f6154c8ec207f5e0bd416bd108d73d5dea1a
Saldo pool tokens: 638856008
Saldo Drex: 130106.62
Saldo TPFt: 0.35

Compra de TPFt com entrada de R$ 81.627,4


