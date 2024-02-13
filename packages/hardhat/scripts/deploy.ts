import { ethers } from "hardhat";

async function main() {
  const miniPayNFT = await ethers.deployContract("MiniPay", [
    "0x0D6Dc2f182Eafa687090F95466d5368726C1ca45",
  ]);

  await miniPayNFT.waitForDeployment();

  console.log("Minipay NFT address - " + (await miniPayNFT.getAddress()));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
