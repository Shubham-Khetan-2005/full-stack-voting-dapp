import { useState, useEffect } from "react";
import { Contract } from "ethers";
import VotingABI from "./VotingABI.json";

export default function AdminPanel({ provider, account, contractAddress }) {
  const [isOwner, setIsOwner]     = useState(false);
  const [voterAddr, setVoterAddr] = useState("");
  const [proposalName, setProposalName] = useState("");
  const [error, setError]         = useState("");      // NEW

  /* ---------- owner check ---------- */
  useEffect(() => {
    if (!provider) return;
    (async () => {
      const voting = new Contract(contractAddress, VotingABI.abi, provider);
      const owner  = await voting.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
    })();
  }, [provider, account, contractAddress]);

  if (!isOwner) return null;

  /* ---------- helpers with try-catch ---------- */
  const prettyErr = (e) => {
    // ethers v6 puts revert reason at e.shortMessage
    const msg = e.shortMessage || e.message || "Transaction failed";
    setError(msg.replace("execution reverted:", "").trim());
    setTimeout(() => setError(""), 5000);              // auto-dismiss
  };

  const register = async () => {
    try {
      const voting = new Contract(contractAddress, VotingABI.abi, await provider.getSigner());
      await (await voting.registerVoter(voterAddr)).wait();
      setVoterAddr("");
    } catch (e) { prettyErr(e); }
  };

  const add = async () => {
    try {
      const voting = new Contract(contractAddress, VotingABI.abi, await provider.getSigner());
      await (await voting.addProposal(proposalName)).wait();
      setProposalName("");
    } catch (e) { prettyErr(e); }
  };

  /* ---------- UI ---------- */
  return (
    <div className="card">
      <h3>Admin panel (chairperson only)</h3>

      {error && <div className="alert-error">{error}</div>}

      <div>
        <input
          type="text"
          value={voterAddr}
          placeholder="0x… voter address"
          onChange={(e) => setVoterAddr(e.target.value)}
        />
        <button onClick={register}>Register voter</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          value={proposalName}
          placeholder="Proposal title"
          onChange={(e) => setProposalName(e.target.value)}
        />
        <button onClick={add}>Add proposal</button>
      </div>
    </div>
  );
}
