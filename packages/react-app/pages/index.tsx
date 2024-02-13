import PrimaryButton from "@/components/Button";
import { useWeb3 } from "@/contexts/useWeb3";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    address,
    getUserAddress,
    sendCUSD,
    mintMinipayNFT,
    getNFTs,
    signTransaction,
  } = useWeb3();
  const [cUSDLoading, setCUSDLoading] = useState(false);
  const [nftLoading, setNFTLoading] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [userOwnedNFTs, setUserOwnedNFTs] = useState<string[]>([]);
  const [tx, setTx] = useState<any>(undefined);

  useEffect(() => {
    getUserAddress().then(async () => {
      const tokenURIs = await getNFTs();
      setUserOwnedNFTs(tokenURIs);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h1">
        There you go... a canvas for your next Minipay project!
      </div>
      {address && (
        <>
          <div className="h2 text-center">
            Your address: <span className="font-bold text-sm">{address}</span>
          </div>
          {tx && (
            <p className="font-bold mt-4">
              Tx Completed: {(tx.hash as string).substring(0, 6)}...
              {(tx.hash as string).substring(
                tx.hash.length - 6,
                tx.hash.length
              )}
            </p>
          )}
          <div className="w-full px-3 mt-7">
            <PrimaryButton
              loading={signingLoading}
              onClick={async () => {
                setSigningLoading(true);
                const tx = await sendCUSD(address, "0.1");
                setTx(tx);
                setSigningLoading(false);
              }}
              title="Send 0.1 cUSD to your own address"
              widthFull
            />
          </div>

          <div className="w-full px-3 mt-6">
            <PrimaryButton
              loading={cUSDLoading}
              onClick={async () => {
                setCUSDLoading(true);
                await signTransaction();
                setCUSDLoading(false);
              }}
              title="Sign a Transaction"
              widthFull
            />
          </div>

          {userOwnedNFTs.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full mt-7">
              <p className="font-bold">My NFTs</p>
              <div className="w-full grid grid-cols-2 gap-3 mt-3 px-2">
                {userOwnedNFTs.map((tokenURI, index) => (
                  <div
                    key={index}
                    className="p-2 border-[3px] border-colors-secondary rounded-xl"
                  >
                    <Image
                      alt="MINIPAY NFT"
                      src={tokenURI}
                      className="w-[160px] h-[200px] object-cover"
                      width={160}
                      height={200}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5">You do not have any NFTs yet</div>
          )}

          <div className="w-full px-3 mt-5">
            <PrimaryButton
              loading={nftLoading}
              onClick={async () => {
                setNFTLoading(true);
                const tx = await mintMinipayNFT();
                const tokenURIs = await getNFTs();
                setUserOwnedNFTs(tokenURIs);
                setTx(tx);
                setNFTLoading(false);
              }}
              title="Mint Minipay NFT"
              widthFull
            />
          </div>
        </>
      )}
    </div>
  );
}
