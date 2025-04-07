# Drex - Pool de Liquidez

## Setup Inicial
```shell
npm install
export USER_WALLET_PK=abc...
```

Antes do primeiro uso, garanta que a carteira a ser utilizada esteja habilitada para DREX, contenha saldo para as operações e que os contratos do pool estejam autorizados (approve das moedas).

## Autorização
Para autorizar os contratos do pool de liquidez execute o comando:
```shell
npx hardhat run scripts/exec/poolUserPermissions.ts --network besu
```

## Adicionar liquidez no pool.
Garanta que a carteira tenha saldo maior ou igual aos valores de desejados do par de moedas (TPFt e DREX).
Antes de executar edite os valores no script.
```shell
npx hardhat run scripts/exec/addLiquidity.ts --network besu
```

## Compra de TPFT
Garanta que a carteira tenha saldo maior ou igual ao valor de desejado em DREX para compra de TPFt.
Antes de executar edite os valores no script.
```shell
npx hardhat run scripts/exec/swapDrexInTpftOut.ts --network besu
```

## Venda de TPFT
Garanta que a carteira tenha saldo maior ou igual ao valor de desejado em TPFt para venda.
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