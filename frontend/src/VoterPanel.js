import { useEffect, useState } from "react";
import { Contract } from "ethers";
import VotingABI from "./VotingABI.json";

export default function VoterPanel({ provider, contractAddress, proposals }) {
  const [delegateAddr, setDelegateAddr] = useState("");
  const [hasVoted, setHasVoted]         = useState(false);

  /* ---------- fetch voter status ---------- */
  useEffect(() => {
    if (!provider) return;
    (async () => {
      const voting  = new Contract(contractAddress, VotingABI.abi, provider);
      const signer  = await provider.getSigner();
      const me      = await signer.getAddress();
      const info    = await voting.voters(me);
      setHasVoted(info.hasVoted);
    })();
  }, [provider, proposals, contractAddress]);

  /* ---------- tx helpers ---------- */
  const vote = async (id) => {
    const signer = await provider.getSigner();
    const voting = new Contract(contractAddress, VotingABI.abi, signer);
    await (await voting.vote(id)).wait();
    setHasVoted(true);                    // instantly update UI
  };

  const delegate = async () => {
    const signer = await provider.getSigner();
    const voting = new Contract(contractAddress, VotingABI.abi, signer);
    await (await voting.delegate(delegateAddr)).wait();
    setDelegateAddr("");
  };

  /* ---------- UI ---------- */
  return (
    <div className="card">
      {hasVoted && (
        <div className="alert-success">
          Congratulations, you have voted 🎉
        </div>
      )}

      <h3>Vote for a proposal</h3>

      {proposals.map((p) => (
        <div key={p.id} className="proposal-row">
          <span>
            #{p.id} – {p.name} ({p.votes.toString()} votes)
          </span>
          <button
            onClick={() => vote(p.id)}
            disabled={hasVoted}            /* ← disables buttons */
          >
            Vote
          </button>
        </div>
      ))}

      <h4 style={{ marginTop: 24 }}>Delegate your vote</h4>
      <input
        type="text"
        value={delegateAddr}
        placeholder="0x… delegate address"
        onChange={(e) => setDelegateAddr(e.target.value)}
      />
      <button onClick={delegate} disabled={!delegateAddr || hasVoted}>
        Delegate
      </button>
    </div>
  );
}
