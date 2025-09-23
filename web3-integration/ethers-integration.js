/**
 * Ethers.js Integration for Certificate Verification dApp
 * This file demonstrates how to integrate the smart contract with a React frontend
 */

import { ethers } from 'ethers';
import CertificateVerificationABI from '../contracts/CertificateVerification.json';

// Contract configuration
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D045A879689996F4'; // Replace with actual deployed address
const SEPOLIA_CHAIN_ID = '0x1A4'; // 420 in hex

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.userAddress = null;
  }

  // Initialize Web3 connection
  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.userAddress = await this.signer.getAddress();
        
        // Initialize contract
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CertificateVerificationABI.abi,
          this.signer
        );
        
        // Setup network
        await this.switchToSepolia();
        
        console.log('Web3 initialized successfully');
        return true;
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        return false;
      }
    } else {
      console.error('MetaMask not detected');
      return false;
    }
  }

  // Switch to Sepolia testnet
  async switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      }
    }
  }

  // Get user's wallet balance
  async getBalance() {
    try {
      const balance = await this.provider.getBalance(this.userAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0.0';
    }
  }

  // Register institution on blockchain
  async registerInstitution(name, email, address) {
    try {
      const tx = await this.contract.registerInstitution(name, email, address);
      
      console.log('Transaction submitted:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      
      // Extract event data
      const event = receipt.events.find(e => e.event === 'InstitutionRegistered');
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        institutionAddress: event.args.institutionAddress
      };
    } catch (error) {
      console.error('Failed to register institution:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Issue certificate on blockchain
  async issueCertificate(recipientName, courseName, completionDate, grade) {
    try {
      // Estimate gas first
      const gasEstimate = await this.contract.estimateGas.issueCertificate(
        recipientName,
        courseName,
        completionDate,
        grade
      );
      
      console.log('Estimated gas:', gasEstimate.toString());
      
      const tx = await this.contract.issueCertificate(
        recipientName,
        courseName,
        completionDate,
        grade,
        {
          gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
        }
      );
      
      console.log('Certificate issuance transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      
      // Extract certificate hash from events
      const event = receipt.events.find(e => e.event === 'CertificateIssued');
      const certificateHash = event.args.certificateHash;
      
      return {
        success: true,
        certificateHash,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify certificate on blockchain
  async verifyCertificate(certificateHash) {
    try {
      // First check if certificate exists
      const certificate = await this.contract.getCertificate(certificateHash);
      
      // Call verification function (this creates a transaction)
      const tx = await this.contract.verifyCertificate(certificateHash);
      const receipt = await tx.wait();
      
      return {
        success: true,
        certificate: {
          certificateHash: certificate.certificateHash,
          recipientName: certificate.recipientName,
          courseName: certificate.courseName,
          completionDate: certificate.completionDate,
          grade: certificate.grade,
          institutionAddress: certificate.institutionAddress,
          issuedAt: new Date(certificate.issuedAt.toNumber() * 1000),
          isValid: certificate.isValid
        },
        verificationTransaction: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get institution details
  async getInstitution(address) {
    try {
      const institution = await this.contract.getInstitution(address);
      
      return {
        name: institution.name,
        email: institution.email,
        physicalAddress: institution.physicalAddress,
        walletAddress: institution.walletAddress,
        isVerified: institution.isVerified,
        registeredAt: new Date(institution.registeredAt.toNumber() * 1000),
        certificatesIssued: institution.certificatesIssued.toNumber()
      };
    } catch (error) {
      console.error('Failed to get institution:', error);
      return null;
    }
  }

  // Get contract statistics
  async getContractStats() {
    try {
      const stats = await this.contract.getContractStats();
      
      return {
        totalInstitutions: stats.totalInsts.toNumber(),
        totalCertificates: stats.totalCerts.toNumber(),
        contractOwner: stats.contractOwner
      };
    } catch (error) {
      console.error('Failed to get contract stats:', error);
      return null;
    }
  }

  // Listen to contract events
  setupEventListeners() {
    if (!this.contract) return;

    // Listen for new institutions
    this.contract.on('InstitutionRegistered', (institutionAddress, name, timestamp) => {
      console.log('New institution registered:', {
        address: institutionAddress,
        name,
        timestamp: new Date(timestamp.toNumber() * 1000)
      });
      
      // Trigger UI update
      window.dispatchEvent(new CustomEvent('institutionRegistered', {
        detail: { institutionAddress, name, timestamp }
      }));
    });

    // Listen for new certificates
    this.contract.on('CertificateIssued', (certificateHash, institutionAddress, recipientName, courseName, timestamp) => {
      console.log('New certificate issued:', {
        hash: certificateHash,
        institution: institutionAddress,
        recipient: recipientName,
        course: courseName,
        timestamp: new Date(timestamp.toNumber() * 1000)
      });
      
      // Trigger UI update
      window.dispatchEvent(new CustomEvent('certificateIssued', {
        detail: { certificateHash, institutionAddress, recipientName, courseName, timestamp }
      }));
    });

    // Listen for certificate verifications
    this.contract.on('CertificateVerified', (certificateHash, verifier, timestamp) => {
      console.log('Certificate verified:', {
        hash: certificateHash,
        verifier,
        timestamp: new Date(timestamp.toNumber() * 1000)
      });
    });
  }

  // Clean up event listeners
  removeEventListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  // Utility function to format addresses
  static formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Utility function to calculate gas cost in ETH
  static calculateGasCostETH(gasUsed, gasPrice) {
    const gasCost = gasUsed.mul(gasPrice);
    return ethers.utils.formatEther(gasCost);
  }
}

// React Hook for Web3 integration
export const useWeb3 = () => {
  const [web3Service, setWeb3Service] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [balance, setBalance] = useState('0.0');

  useEffect(() => {
    const initWeb3 = async () => {
      const service = new Web3Service();
      const connected = await service.initialize();
      
      if (connected) {
        setWeb3Service(service);
        setIsConnected(true);
        setUserAddress(service.userAddress);
        
        const userBalance = await service.getBalance();
        setBalance(userBalance);
        
        // Setup event listeners
        service.setupEventListeners();
      }
    };

    initWeb3();

    // Cleanup on unmount
    return () => {
      if (web3Service) {
        web3Service.removeEventListeners();
      }
    };
  }, []);

  const disconnect = () => {
    if (web3Service) {
      web3Service.removeEventListeners();
    }
    setWeb3Service(null);
    setIsConnected(false);
    setUserAddress('');
    setBalance('0.0');
  };

  return {
    web3Service,
    isConnected,
    userAddress,
    balance,
    disconnect
  };
};

export default Web3Service;