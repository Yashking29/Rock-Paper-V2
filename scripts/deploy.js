import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const Insurance = await ethers.getContractFactory("RockPaperScissors");
  const insurance = await Insurance.deploy();

  await insurance.deployed();  // ✅ Fix: Use `deployed()` instead of `waitForDeployment()`
  const contractAddress = insurance.address;  // ✅ Fix: Use `.address` instead of `getAddress()`

  console.log("Contract deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
