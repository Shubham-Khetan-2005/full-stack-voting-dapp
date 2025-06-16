// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
        address delegate;
        uint weight;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;
    uint public votingDeadline;

    event VoteCast(address voter, uint proposalId) ;
    event VoterRegistered(address voter) ;
    event VoteDelegated(address from, address to);

    constructor (address initialOwner) Ownable(initialOwner) {
        votingDeadline = block.timestamp + 1 weeks;
    }

    modifier onlyDuringVotingPeriod() {
        require(block.timestamp <= votingDeadline, "Voting period has ended");
        _;
    }

    function registerVoter(address voter) external onlyOwner {
        require(!voters[voter].isRegistered, "Voter is already registered");
        voters[voter].isRegistered = true;
        voters[voter].weight = 1;
        emit VoterRegistered(voter);
    }

    function addProposal(string memory name) external onlyOwner {
        Proposal memory newProposal = Proposal({name: name, voteCount: 0});
        proposals.push(newProposal);
    }

    function vote(uint proposalId) public onlyDuringVotingPeriod{
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        require(proposalId < proposals.length, "Proposal invalid");
        proposals[proposalId].voteCount += voters[msg.sender].weight;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;
        emit VoteCast(msg.sender, proposalId);
    }

    function delegate(address to) public onlyDuringVotingPeriod {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "Not registered");
        require(!sender.hasVoted, "Already voted");
        require(to != msg.sender, "Cannot delegate to self");

        // Forward delegation if 'to' already delegated
        address current = to;
        while (voters[current].delegate != address(0)) {
            current = voters[current].delegate;
            require(current != msg.sender, "Delegation loop detected");
        }

        sender.hasVoted = true;
        sender.delegate = current;

        Voter storage delegateTo = voters[current];
        if (delegateTo.hasVoted) {
            // If the delegate already voted, add weight to their chosen proposal
            proposals[delegateTo.votedProposalId].voteCount += sender.weight;
        } else {
            // If not, add weight to delegate's weight
            delegateTo.weight += sender.weight;
        }
        emit VoteDelegated(msg.sender, current);
    }

    function getWinner() public view returns (uint winningProposalId, string memory winnerName, uint winnerVotes) {
        uint maxVotes = 0;
        uint winningId = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winningId = i;
            }
        }
        return (winningId, proposals[winningId].name, proposals[winningId].voteCount);
    }

}   