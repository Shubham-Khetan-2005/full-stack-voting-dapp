const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", () => {
  let Voting, voting;
  let owner, alice, bob, charlie;

  beforeEach(async () => {
    [owner, alice, bob, charlie] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(owner.address); // constructor arg
    await voting.waitForDeployment();
  });

  //---------------------------- Ownership ------------------------------------
  it("sets the chairperson (owner) correctly", async () => {
    expect(await voting.owner()).to.equal(owner.address);
  });

  //---------------------------- Registration ------------------------------------
  it("lets only owner register voters", async () => {
    await voting.registerVoter(alice.address);
    expect((await voting.voters(alice.address)).isRegistered).to.be.true;

    await expect(voting.connect(alice).registerVoter(bob.address))
      .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
      .withArgs(alice.address); 
  });

  it("reverts when registering the same voter twice", async () => {
    await voting.registerVoter(alice.address);
    await expect(voting.registerVoter(alice.address)).to.be.revertedWith(
      "Voter is already registered"
    );
  });

  //---------------------------- Proposals ------------------------------------

  it("allows only owner to add proposals", async () => {
    await voting.addProposal("Proposal 1");
    const p0 = await voting.proposals(0);
    expect(p0.name).to.equal("Proposal 1");
    expect(p0.voteCount).to.equal(0);

    await expect(voting.connect(alice).addProposal("Bad proposal"))
      .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
      .withArgs(alice.address);
  });


  //---------------------------- Voting ------------------------------------

  it("allows a registered voter to vote exactly once", async () => {
    await voting.registerVoter(alice.address);
    await voting.addProposal("Proposal 1");

    await voting.connect(alice).vote(0);
    expect((await voting.proposals(0)).voteCount).to.equal(1);

    await expect(voting.connect(alice).vote(0)).to.be.revertedWith(
      "Voter has already voted"
    );
  });

  it("blocks unregistered voters", async () => {
    await voting.addProposal("Proposal 1");
    await expect(voting.connect(bob).vote(0)).to.be.revertedWith(
      "Voter is not registered"
    );
  });

  it("blocks voting after the one-week deadline", async () => {
    await voting.registerVoter(alice.address);
    await voting.addProposal("Proposal 1");

    // jump 8 days forward on Hardhat’s local EVM
    await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await expect(voting.connect(alice).vote(0)).to.be.revertedWith(
      "Voting period has ended"
    );
  });

  //---------------------------- Delegation ------------------------------------
     
  it("lets voters delegate and counts weights properly", async () => {
    await voting.registerVoter(alice.address);
    await voting.registerVoter(bob.address);
    await voting.addProposal("Proposal 1");

    await voting.connect(alice).delegate(bob.address); // Alice → Bob
    await voting.connect(bob).vote(0); // Bob votes

    expect((await voting.proposals(0)).voteCount).to.equal(2); // weight 2
  });

  it("detects delegation loops", async () => {
    await voting.registerVoter(alice.address);
    await voting.registerVoter(bob.address);
    await voting.registerVoter(charlie.address);

    await voting.connect(alice).delegate(bob.address); // A → B
    await voting.connect(bob).delegate(charlie.address); // B → C

    await expect(
      // C → A (loop)
      voting.connect(charlie).delegate(alice.address)
    ).to.be.revertedWith("Delegation loop detected");
  });

  // ---------------------------- Winner ------------------------------------
  it("returns the proposal with the most votes", async () => {
    await voting.registerVoter(alice.address);
    await voting.registerVoter(bob.address);
    await voting.registerVoter(charlie.address);

    await voting.addProposal("P1");
    await voting.addProposal("P2");

    await voting.connect(alice).vote(0); // P1: 1
    await voting.connect(bob).vote(1); // P2: 1
    await voting.connect(charlie).vote(1); // P2: 2

    const winner = await voting.getWinner();
    expect(winner.winningProposalId).to.equal(1);
    expect(winner.winnerName).to.equal("P2");
    expect(winner.winnerVotes).to.equal(2);
  });
});
