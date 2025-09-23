import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { 
  Wallet, 
  Shield, 
  Award, 
  Building2, 
  Search, 
  CheckCircle, 
  ExternalLink,
  Copy,
  Eye,
  Plus,
  Blocks,
  Activity,
  TrendingUp
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Web3 Context
const Web3Context = React.createContext();

const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

const Web3Provider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Simulate MetaMask connection
      const response = await axios.post(`${API}/wallet/connect`, {});
      setWallet(response.data);
      setConnected(true);
      localStorage.setItem('wallet', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setConnected(false);
    localStorage.removeItem('wallet');
  };

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
      setConnected(true);
    }
  }, []);

  return (
    <Web3Context.Provider value={{ 
      wallet, 
      connected, 
      loading, 
      connectWallet, 
      disconnectWallet 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

// Components
const LandingPage = () => {
  const { connectWallet } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">CertChain</h1>
          </div>
          <Button 
            onClick={connectWallet}
            data-testid="connect-wallet-btn"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Blockchain-Based
            <span className="text-indigo-600 block">Certificate Verification</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Issue, verify, and manage educational certificates on the blockchain. 
            Tamper-proof, decentralized, and instantly verifiable worldwide.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Institution Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Register your institution and issue tamper-proof certificates on the blockchain.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Certificate Issuance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create immutable certificates with cryptographic hashes and smart contracts.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <Search className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Public Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Instantly verify any certificate's authenticity using blockchain technology.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">Web3 Features</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="text-sm px-3 py-1">Smart Contracts</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">MetaMask Integration</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">Decentralized Storage</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">Cryptographic Hashing</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">Gas Optimization</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">Event Logging</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const WalletConnect = () => {
  const { wallet, connected, loading, connectWallet, disconnectWallet } = useWeb3();

  if (!connected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Wallet className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to access the dApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectWallet} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            data-testid="wallet-connect-btn"
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Wallet Connected</span>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600">Address</Label>
          <div className="flex items-center space-x-2 mt-1">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 truncate">
              {wallet.address}
            </code>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-sm text-gray-600">Balance</Label>
          <div className="text-lg font-semibold">{wallet.balance} ETH</div>
        </div>
        <Button 
          variant="outline" 
          onClick={disconnectWallet}
          className="w-full"
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
};

const InstitutionPortal = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(null);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get(`${API}/institutions`);
      setInstitutions(response.data);
    } catch (error) {
      console.error('Failed to fetch institutions:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/institutions/register`, formData);
      setRegistered(response.data);
      setFormData({ name: '', email: '', address: '' });
      fetchInstitutions();
    } catch (error) {
      console.error('Failed to register institution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Institution Portal</h2>
        <p className="text-gray-600">Register your institution on the blockchain</p>
      </div>

      {registered && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Institution Registered Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Transaction Hash:</strong> <code>{registered.transaction_hash}</code></p>
              <p><strong>Block Number:</strong> {registered.block_number}</p>
              <p><strong>Gas Used:</strong> {registered.gas_used}</p>
              <p><strong>Wallet Address:</strong> <code>{registered.wallet_address}</code></p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Register Institution</CardTitle>
            <CardDescription>Submit your institution details to the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  data-testid="institution-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="University of Technology"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="institution-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@university.edu"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  data-testid="institution-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 University Ave, City, State"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                data-testid="register-institution-btn"
              >
                {loading ? 'Registering...' : 'Register Institution'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Institutions</CardTitle>
            <CardDescription>Verified institutions on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {institutions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No institutions registered yet</p>
            ) : (
              <div className="space-y-3">
                {institutions.slice(0, 5).map((inst) => (
                  <div key={inst.id} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{inst.name}</h4>
                    <p className="text-sm text-gray-600">{inst.email}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CertificateIssuance = () => {
  const { wallet, connected } = useWeb3();
  const [institutions, setInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    recipient_name: '',
    course_name: '',
    completion_date: '',
    grade: '',
    institution_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get(`${API}/institutions`);
      setInstitutions(response.data);
    } catch (error) {
      console.error('Failed to fetch institutions:', error);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${API}/certificates/issue?wallet_address=${wallet.address}`,
        formData
      );
      setIssued(response.data);
      setFormData({
        recipient_name: '',
        course_name: '',
        completion_date: '',
        grade: '',
        institution_id: ''
      });
    } catch (error) {
      console.error('Failed to issue certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-16">
        <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Wallet Required</h3>
        <p className="text-gray-500">Please connect your wallet to issue certificates</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Issue Certificate</h2>
        <p className="text-gray-600">Create a tamper-proof certificate on the blockchain</p>
      </div>

      {issued && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Certificate Issued Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Certificate Hash:</strong> <code>{issued.certificate_hash}</code></p>
              <p><strong>Transaction Hash:</strong> <code>{issued.transaction_hash}</code></p>
              <p><strong>Block Number:</strong> {issued.block_number}</p>
              <p><strong>Gas Used:</strong> {issued.gas_used}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>Enter the certificate information to be recorded on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input
                id="recipient"
                data-testid="recipient-name"
                value={formData.recipient_name}
                onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="course">Course Name</Label>
              <Input
                id="course"
                data-testid="course-name"
                value={formData.course_name}
                onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                placeholder="Bachelor of Computer Science"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date">Completion Date</Label>
              <Input
                id="date"
                data-testid="completion-date"
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({...formData, completion_date: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="grade">Grade (Optional)</Label>
              <Input
                id="grade"
                data-testid="grade"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                placeholder="A+"
              />
            </div>
            
            <div>
              <Label>Institution</Label>
              <Select 
                value={formData.institution_id} 
                onValueChange={(value) => setFormData({...formData, institution_id: value})}
              >
                <SelectTrigger data-testid="institution-select">
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              data-testid="issue-certificate-btn"
            >
              {loading ? 'Issuing Certificate...' : 'Issue Certificate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const CertificateVerification = () => {
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${API}/certificates`);
      setCertificates(response.data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchHash.trim()) return;

    setLoading(true);
    setVerificationResult(null);
    
    try {
      const response = await axios.get(`${API}/certificates/verify/${searchHash.trim()}`);
      setVerificationResult(response.data);
    } catch (error) {
      setVerificationResult({ 
        verified: false, 
        error: error.response?.data?.detail || 'Certificate not found' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h2>
        <p className="text-gray-600">Verify the authenticity of any certificate on the blockchain</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Verify Certificate
          </CardTitle>
          <CardDescription>Enter the certificate hash to verify its authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="hash">Certificate Hash</Label>
              <Input
                id="hash"
                data-testid="certificate-hash"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Enter certificate hash..."
                className="font-mono"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              data-testid="verify-btn"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card className={`max-w-2xl mx-auto ${verificationResult.verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${verificationResult.verified ? 'text-green-800' : 'text-red-800'}`}>
              {verificationResult.verified ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Certificate Verified
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Verification Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verificationResult.verified ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Recipient</Label>
                    <p className="font-semibold">{verificationResult.certificate.recipient_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Course</Label>
                    <p className="font-semibold">{verificationResult.certificate.course_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Institution</Label>
                    <p className="font-semibold">{verificationResult.certificate.institution_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Completion Date</Label>
                    <p className="font-semibold">{verificationResult.certificate.completion_date}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <p><strong>Verification Transaction:</strong> <code>{verificationResult.verification_transaction}</code></p>
                  <p><strong>Block Number:</strong> {verificationResult.block_number}</p>
                  <p><strong>Verified At:</strong> {new Date(verificationResult.verification_timestamp * 1000).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-700">{verificationResult.error}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Certificates</CardTitle>
          <CardDescription>Click on any certificate hash to verify</CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No certificates issued yet</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div 
                  key={cert.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSearchHash(cert.certificate_hash)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{cert.recipient_name}</h4>
                      <p className="text-sm text-gray-600">{cert.course_name}</p>
                      <p className="text-sm text-gray-500">By {cert.institution_name}</p>
                    </div>
                    <Badge variant="secondary">Block #{cert.block_number}</Badge>
                  </div>
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 block">
                    {cert.certificate_hash}
                  </code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BlockchainExplorer = () => {
  const [stats, setStats] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const [statsRes, blocksRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/blockchain/stats`),
        axios.get(`${API}/blockchain/blocks`),
        axios.get(`${API}/blockchain/transactions`)
      ]);
      
      setStats(statsRes.data);
      setBlocks(blocksRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Blockchain Explorer</h2>
        <p className="text-gray-600">Explore blocks, transactions, and network statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_blocks || 0}</div>
            <p className="text-xs text-gray-500">Blocks mined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_transactions || 0}</div>
            <p className="text-xs text-gray-500">Confirmed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_certificates || 0}</div>
            <p className="text-xs text-gray-500">On-chain certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gas Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.current_gas_price || 0}</div>
            <p className="text-xs text-gray-500">Gwei</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Blocks className="h-5 w-5 mr-2" />
              Recent Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blocks.slice(-5).reverse().map((block) => (
                <div key={block.blockNumber} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Block #{block.blockNumber}</span>
                    <Badge variant="outline">{block.transactions.length} txs</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Gas Used: {block.gasUsed.toLocaleString()}</p>
                    <p>Time: {new Date(block.timestamp * 1000).toLocaleString()}</p>
                  </div>
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 block truncate">
                    {block.hash}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(-5).reverse().map((tx) => (
                <div key={tx.hash} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold capitalize">{tx.operation.replace('_', ' ')}</span>
                    <Badge 
                      variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                      className={tx.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Gas: {tx.gasUsed.toLocaleString()}</p>
                    <p>Block: #{tx.blockNumber || 'Pending'}</p>
                  </div>
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 block truncate">
                    {tx.hash}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardApp = () => {
  const { wallet, connected } = useWeb3();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">CertChain</h1>
            </div>
            {connected && wallet && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Connected Wallet</p>
                  <code className="text-xs">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</code>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="font-semibold">{wallet.balance} ETH</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger data-testid="overview-tab" value="overview">Overview</TabsTrigger>
            <TabsTrigger data-testid="institutions-tab" value="institutions">Institutions</TabsTrigger>
            <TabsTrigger data-testid="certificates-tab" value="certificates">Issue Certificates</TabsTrigger>
            <TabsTrigger data-testid="verification-tab" value="verification">Verify</TabsTrigger>
            <TabsTrigger data-testid="explorer-tab" value="explorer">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <WalletConnect />
          </TabsContent>

          <TabsContent value="institutions">
            <InstitutionPortal />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateIssuance />
          </TabsContent>

          <TabsContent value="verification">
            <CertificateVerification />
          </TabsContent>

          <TabsContent value="explorer">
            <BlockchainExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppRouter />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Web3Provider>
  );
}

const AppRouter = () => {
  const { connected } = useWeb3();

  return connected ? <DashboardApp /> : <LandingPage />;
};

export default App;