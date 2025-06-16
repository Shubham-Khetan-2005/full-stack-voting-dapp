import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";

export default function useWallet() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount]   = useState(null);
  const [chainId, setChainId]   = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }
    const prov = new BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);         // triggers MetaMask[2]
    const signer  = await prov.getSigner();
    setAccount(await signer.getAddress());
    setChainId(Number((await prov.getNetwork()).chainId));
    setProvider(prov);
  }, []);

  // reload state if user switches accounts
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", () => connect());
    window.ethereum.on("chainChanged", () => window.location.reload());
  }, [connect]);

  return { provider, account, chainId, connect };
}
