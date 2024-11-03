import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MiniPayModule = buildModule("MiniPayModule", (m) => {
  // Set up parameters if you want to make the contract address configurable
  const initialOwner = m.getParameter(
    "initialOwner",
    "0x1724707c52de2fa65ad9c586b5d38507f52D3c06"
  );

  // Deploy the MiniPay contract with the specified parameters
  const miniPayNFT = m.contract("MiniPay", [initialOwner]);

  return { miniPayNFT };
});

export default MiniPayModule;

