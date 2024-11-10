# Celo Composer - MiniPay Template | Hardhat

## How to use

1. Create a copy of `.env.example` and rename it to `.env`.

   1. For the **smart contract deployment** you will need the `PRIVATE_KEY` set in `.env`. **Never** use a wallet with real funds for development. Always have a separate wallet for testing. 
   2. For the **smart contract verification** you will need a [Celoscan API Key](https://celoscan.io/myapikey) `CELOSCAN_API_KEY` set in `.env`.

2. Compile the contract 

```bash
npx hardhat compile
```

3. Deploy the contract

Make sure your wallet is funded when deploying to testnet or mainnet. You can get test tokens for deploying it on Alfajores from the [Celo Faucet](https://faucet.celo.org/alfajores).

```bash
npx hardhat ignition deploy ./ignition/modules/MiniPay.ts --network <network-name>
```

On Alfajores

```bash
npx hardhat ignition deploy ./ignition/modules/MiniPay.ts --network alfajores
```


On Celo Mainnet

```bash
npx hardhat ignition deploy ./ignition/modules/MiniPay.ts --network celo
```

4. Verify the contract

For Alfajores (Testnet) Verification

```bash
npx hardhat verify <CONTRACT_ADDRESS>  <CONSTRUCTOR_ARGS> --network alfajores
```

For the MiniPay.sol contract that could look like this:

```bash
npx hardhat verify 0xF9316Ce3E661D704000bCDDA925766Bf7F09fF5B 0x1724707c52de2fa65ad9c586b5d38507f52D3c06  --network alfajores
```

For Celo Mainnet Verification

```bash
npx hardhat verify <CONTRACT_ADDRESS>  <CONSTRUCTOR_ARGS> --network celo
```

Check the file `hardhat.config.js` for Celo specific hardhat configuration.
