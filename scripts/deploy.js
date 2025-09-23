const hre = require("hardhat");

async function main() {
  console.log("Deploying Certificate Verification Contract...");
  
  // Get the contract factory
  const CertificateVerification = await hre.ethers.getContractFactory("CertificateVerification");
  
  // Deploy the contract
  const certificateVerification = await CertificateVerification.deploy();
  
  // Wait for deployment to be mined
  await certificateVerification.deployed();
  
  console.log(`Certificate Verification deployed to: ${certificateVerification.address}`);
  
  // Verify contract on Etherscan (optional)
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await certificateVerification.deployTransaction.wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: certificateVerification.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });