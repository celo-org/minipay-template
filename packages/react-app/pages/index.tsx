/* eslint-disable react-hooks/exhaustive-deps */
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
        getUserAddress();
    }, []);

    useEffect(() => {
        const getData = async () => {
            const tokenURIs = await getNFTs();
            setUserOwnedNFTs(tokenURIs);
        };
        if (address) {
            getData();
        }
    }, [address]);

    async function sendingCUSD() {
        if (address) {
            setSigningLoading(true);
            try {
                const tx = await sendCUSD(address, "0.1");
                setTx(tx);
            } catch (error) {
                console.log(error);
            } finally {
                setSigningLoading(false);
            }
        }
    }

    async function signMessage() {
        setCUSDLoading(true);
        try {
            await signTransaction();
        } catch (error) {
            console.log(error);
        } finally {
            setCUSDLoading(false);
        }
    }

    async function mintNFT() {
        setNFTLoading(true);
        try {
            const tx = await mintMinipayNFT();
            const tokenURIs = await getNFTs();
            setUserOwnedNFTs(tokenURIs);
            setTx(tx);
        } catch (error) {
            console.log(error);
        } finally {
            setNFTLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            {!address && (
                <div className="h1">Please install Metamask and connect.</div>
            )}
            {address && (
                <div className="h1">
                    There you go... a canvas for your next Minipay project!
                </div>
            )}

            {address && (
                <>
                    <div className="h2 text-center">
                        Your address:{" "}
                        <span className="font-bold text-sm">{address}</span>
                    </div>
                    {tx && (
                        <p className="font-bold mt-4">
                            Tx Completed:{" "}
                            {(tx.transactionHash as string).substring(0, 6)}
                            ...
                            {(tx.transactionHash as string).substring(
                                tx.transactionHash.length - 6,
                                tx.transactionHash.length
                            )}
                        </p>
                    )}
                    <div className="w-full px-3 mt-7">
                        <PrimaryButton
                            loading={signingLoading}
                            onClick={sendingCUSD}
                            title="Send 0.1 cUSD to your own address"
                            widthFull
                        />
                    </div>

                    <div className="w-full px-3 mt-6">
                        <PrimaryButton
                            loading={cUSDLoading}
                            onClick={signMessage}
                            title="Sign a Message"
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
                            onClick={mintNFT}
                            title="Mint Minipay NFT"
                            widthFull
                        />
                    </div>
                </>
            )}
        </div>
    );
}
