import { Contract } from "ethers";
import VotingABI from "./VotingABI.json";

export default async function getVotingContract(provider) {
  if (!provider) return null;
  const signer = await provider.getSigner();
  return new Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    VotingABI.abi,
    signer
  );                                              // contract pattern[4]
}
