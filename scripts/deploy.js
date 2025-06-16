/**
 * Deploys Voting.sol and (optionally) verifies it on Etherscan.
 *
 * Usage examples
 * ─────────────────────────────────────────────
 * Local node (Hardhat Network)
 *   npx hardhat run scripts/deploy.js --network localhost
 *
 * Holesky test-net
 *   npx hardhat run scripts/deploy.js --network holesky
 *
 * IMPORTANT – required env vars (create a .env file):
 *   PRIVATE_KEY        = 0x…   // deployer account
 *   HOLESKY_RPC_URL    = https://...
 *   ETHERSCAN_API_KEY  = …     // for verify step (optional)
 *   CHAIRPERSON        = 0x…   // optional – who becomes the owner
 */

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  /* ──────────────────────────────
     1. Gather deployer + constructor arg
     ────────────────────────────── */
  const [deployer] = await hre.ethers.getSigners();
  const chairperson = process.env.CHAIRPERSON || deployer.address;

  console.log("┌─────────────────────────────────────────");
  console.log("│ Network      :", hre.network.name);
  console.log("│ Deployer     :", deployer.address);
  console.log("│ Chairperson  :", chairperson);
  console.log("└─────────────────────────────────────────");

  /* ──────────────────────────────
     2. Compile (Hardhat auto-compiles if artifacts missing,
        but running it explicitly guarantees bytecode is up-to-date)
     ────────────────────────────── */
  await hre.run("compile");

  /* ──────────────────────────────
     3. Deploy
     ────────────────────────────── */
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(chairperson);   // constructor arg
  await voting.waitForDeployment();

  console.log("Voting deployed at:", voting.target);

  /* ──────────────────────────────
     4. Optional Etherscan verification
        – skipped on the in-memory “hardhat” network
        – requires ETHERSCAN_API_KEY in .env
     ────────────────────────────── */
  if (
    hre.network.name !== "hardhat" &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // wait a few blocks so the explorer indexes the tx
    const CONFIRMATIONS = 5;
    console.log(`Waiting ${CONFIRMATIONS} blocks for confirmations…`);
    await voting.deploymentTransaction().wait(CONFIRMATIONS);

    console.log("Verifying on Etherscan…");
    await hre.run("verify:verify", {
      address: voting.target,
      constructorArguments: [chairperson],
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
