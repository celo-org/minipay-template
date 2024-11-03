import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MiniPay, MiniPay__factory } from "../typechain-types";

describe("MiniPay Contract", function () {
  let MiniPayFactory: MiniPay__factory;
  let miniPay: MiniPay;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async () => {
    MiniPayFactory = (await ethers.getContractFactory("MiniPay")) as MiniPay__factory;
    
    // Retrieve the signers and cast them to `SignerWithAddress`
    [owner, addr1, addr2] = (await ethers.getSigners()) as SignerWithAddress[];

    // Use `owner.address` directly instead of `getAddress`
    miniPay = await MiniPayFactory.deploy(owner.address);
    await miniPay.deployed();
  });

  it("should deploy with correct name and symbol", async () => {
    expect(await miniPay.name()).to.equal("MiniPay");
    expect(await miniPay.symbol()).to.equal("MINI");
  });
  
  it("should allow owner to mint NFTs and assign correct URI", async () => {
    await miniPay.safeMint(addr1.address, "https://example.com/nft1");
    expect(await miniPay.ownerOf(0)).to.equal(addr1.address);
    expect(await miniPay.tokenURI(0)).to.equal("https://example.com/nft1");

    await miniPay.safeMint(addr2.address, "https://example.com/nft2");
    expect(await miniPay.ownerOf(1)).to.equal(addr2.address);
    expect(await miniPay.tokenURI(1)).to.equal("https://example.com/nft2");
  });

  it("should not allow non-owner to mint NFTs", async () => {
    await expect(
      miniPay.connect(addr1).safeMint(addr1.address, "https://example.com/nft3")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should pause and unpause the contract", async () => {
    await miniPay.pause();
    await expect(
      miniPay.safeMint(addr1.address, "https://example.com/nft4")
    ).to.be.revertedWith("Pausable: paused");

    await miniPay.unpause();
    await miniPay.safeMint(addr1.address, "https://example.com/nft4");
    expect(await miniPay.ownerOf(0)).to.equal(addr1.address);
  });

  it("should allow owner to burn their NFTs", async () => {
    await miniPay.safeMint(addr1.address, "https://example.com/nft5");
    expect(await miniPay.ownerOf(0)).to.equal(addr1.address);

    await miniPay.connect(addr1).burn(0);
    await expect(miniPay.ownerOf(0)).to.be.revertedWith(
      "ERC721: owner query for nonexistent token"
    );
  });

  it("should retrieve NFTs owned by a specific address", async () => {
    await miniPay.safeMint(addr1.address, "https://example.com/nft6");
    await miniPay.safeMint(addr1.address, "https://example.com/nft7");
    await miniPay.safeMint(addr2.address, "https://example.com/nft8");

    const addr1NFTs = await miniPay.getNFTsByAddress(addr1.address);
    const addr2NFTs = await miniPay.getNFTsByAddress(addr2.address);

    expect(addr1NFTs.map((id) => id.toNumber())).to.deep.equal([0, 1]);
    expect(addr2NFTs.map((id) => id.toNumber())).to.deep.equal([2]);
  });
});
