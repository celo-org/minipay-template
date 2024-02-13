import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useState } from "react";
import StableTokenABI from "./cusd-abi.json";
import MinipayNFTABI from "./minipay-nft.json";

export const useWeb3 = () => {
  const [address, setAddress] = useState<string | null>(null);
  const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const MINIPAY_NFT_CONTRACT = "0xeE3027C2CF6C1f823b657a0220EC96EA710A5Eb3";

  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addressFromWallet = await signer.getAddress();
      setAddress(addressFromWallet);
    }
  };

  const sendCUSD = async (to: string, amount: string) => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const cUSDTokenContract = new Contract(
      cUSDTokenAddress,
      StableTokenABI.abi,
      signer
    );
    const amountInWei = parseUnits(amount, 18);
    const tx = await cUSDTokenContract.transfer(to, amountInWei);
    await tx.wait();
    return tx;
  };

  const mintMinipayNFT = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const minipayNFTContract = new Contract(
      MINIPAY_NFT_CONTRACT,
      MinipayNFTABI.abi,
      signer
    );
    const userAddress = await signer.getAddress();
    const tx = await minipayNFTContract.safeMint(
      userAddress,
      "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp"
    );
    await tx.wait();
    return tx;
  };

  const getNFTs = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const minipayNFTContract = new Contract(
      MINIPAY_NFT_CONTRACT,
      MinipayNFTABI.abi,
      signer
    );
    const userAddress = await signer.getAddress();
    const nfts = await minipayNFTContract.getNFTsByAddress(userAddress);
    let tokenURIs = [];
    for (let i = 0; i < nfts.length; i++) {
      const tokenURI = await minipayNFTContract.tokenURI(nfts[i]);
      tokenURIs.push(tokenURI);
    }
    return tokenURIs;
  };

  const signTransaction = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const res = await signer.signMessage(
      `Hello from Celo Composer Minipay Template!`
    );
    console.log("res", res);
    return res;
  };

  return {
    address,
    getUserAddress,
    sendCUSD,
    mintMinipayNFT,
    getNFTs,
    signTransaction,
  };
};
