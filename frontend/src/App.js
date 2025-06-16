import { useEffect, useState } from "react";
import useWallet from "./useWallet";
import getVotingContract from "./useVoting";
import AdminPanel from "./AdminPanel";
import VoterPanel from "./VoterPanel";
import "./App.css";  

export default function App() {
  const { provider, account, chainId, connect } = useWallet();
  console.log("provider", provider);
  console.log("account", account);
  console.log("chainId", chainId);
  console.log("connect", connect);

  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);

  /* ---------- load proposals & winner ---------- */
  useEffect(() => {
    const load = async () => {
      if (!provider) return;
      const voting = await getVotingContract(provider);

      // 1. read proposals first
      const fetched = [];
      for (let i = 0; ; i++) {
        try {
          const p = await voting.proposals(i);
          fetched.push({ id: i, name: p.name, votes: p.voteCount });
        } catch {
          break; // stop on out-of-bounds
        }
      }
      setProposals(fetched);

      // 2. only call getWinner if there is at least one proposal
      if (fetched.length > 0) {
        const [id, name, votes] = await voting.getWinner();
        setWinner({ id, name, votes });
      }
    };
    load();
  }, [provider]);

  /* ---------- tx helpers ---------- */
  const castVote = async (id) => {
    const voting = getVotingContract(provider);
    await voting.vote(id); // MetaMask pops up
  };

  const delegateTo = async (address) => {
    const voting = getVotingContract(provider);
    await voting.delegate(address);
  };

  /* ---------- render ---------- */
  if (!account) return <button onClick={connect}>Connect Wallet</button>;

  if (chainId !== 17000) return <p>Please switch MetaMask to Holesky.</p>;

  return (
    <div className="main-wrapper">
      <h2>Voting DApp</h2>
      <p>Connected: {account}</p>

      <AdminPanel
        provider={provider}
        account={account}
        contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
      />

      <VoterPanel
        provider={provider}
        contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
        proposals={proposals}
      />

      {winner && (
        <div className="card">
          <h3>Current winner</h3>
          <p>
            <strong>{winner.name}</strong> with {winner.votes.toString()} votes
          </p>
        </div>
      )}
    </div>
  );
}
