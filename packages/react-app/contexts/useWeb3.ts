import { wagmiConfig } from "@/pages/_app";
import { getWalletClient } from "@wagmi/core";

import {
  createPublicClient,
  getContract,
  http,
  parseEther,
  stringToHex,
} from "viem";
import { celoAlfajores } from "viem/chains";
import StableTokenABI from "./cusd-abi.json";
import MinipayNFTABI from "./minipay-nft.json";

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Testnet
const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF"; // Testnet

export const useWeb3 = () => {
  const sendCUSD = async (to: string, amount: string) => {
    try {
      const client = await getWalletClient(wagmiConfig);

      let address = client.account.address;
      const amountInWei = parseEther(amount);

      const tx = await client.writeContract({
        address: cUSDTokenAddress,
        abi: StableTokenABI.abi,
        functionName: "transfer",
        account: address,
        args: [to, amountInWei],
      });

      let receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return receipt;
    } catch (e: any) {}
  };

  const mintMinipayNFT = async () => {
    try {
      const client = await getWalletClient(wagmiConfig);
      let address = client.account.address;

      const tx = await client.writeContract({
        address: MINIPAY_NFT_CONTRACT,
        abi: MinipayNFTABI.abi,
        functionName: "safeMint",
        account: address,
        args: [
          address,
          "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp",
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return receipt;
    } catch (e) {
      alert(e);
    }
  };

  const getNFTs = async (address: string) => {
    const minipayNFTContract = getContract({
      abi: MinipayNFTABI.abi,
      address: MINIPAY_NFT_CONTRACT,
      client: publicClient,
    });

    const nfts: any = await minipayNFTContract.read.getNFTsByAddress([address]);

    let tokenURIs: string[] = [];

    for (let i = 0; i < nfts.length; i++) {
      const tokenURI: string = (await minipayNFTContract.read.tokenURI([
        nfts[i],
      ])) as string;
      tokenURIs.push(tokenURI);
    }
    return tokenURIs;
  };

  const signTransaction = async () => {
    const client = await getWalletClient(wagmiConfig);
    let address = client.account.address;

    const res = await client.signMessage({
      account: address,
      message: stringToHex("Hello from Celo Composer MiniPay Template!"),
    });

    return res;
  };

  return {
    sendCUSD,
    mintMinipayNFT,
    getNFTs,
    signTransaction,
  };
};
