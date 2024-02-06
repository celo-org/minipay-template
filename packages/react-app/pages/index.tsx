import PrimaryButton from "@/components/Button";
import { useWeb3 } from "@/contexts/useWeb3";
import { useEffect, useState } from "react";

export default function Home() {
  const { address, getUserAddress, sendCUSD } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState<any>(undefined);

  useEffect(() => {
    getUserAddress();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h1">
        There you go... a canvas for your next Minipay project!
      </div>
      {address && (
        <>
          <div className="h2 text-center">Your address: {address}</div>
          <div className="w-full px-3 mt-10">
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const tx = await sendCUSD(address, "0.1");
                setTx(tx);
                setLoading(false);
              }}
              title="Send 0.1 cUSD"
              widthFull
            />
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
        </>
      )}
    </div>
  );
}
