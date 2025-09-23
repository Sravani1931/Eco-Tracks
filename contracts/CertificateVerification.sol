// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Certificate Verification Smart Contract
 * @dev This contract manages the issuance and verification of educational certificates on the blockchain
 * @author Web3 Developer
 */
contract CertificateVerification {
    
    // State Variables
    address public owner;
    uint256 public totalCertificates;
    uint256 public totalInstitutions;
    
    // Structs
    struct Institution {
        string name;
        string email;
        string physicalAddress;
        address walletAddress;
        bool isVerified;
        uint256 registeredAt;
        uint256 certificatesIssued;
    }
    
    struct Certificate {
        bytes32 certificateHash;
        string recipientName;
        string courseName;
        string completionDate;
        string grade;
        address institutionAddress;
        uint256 issuedAt;
        bool isValid;
    }
    
    // Mappings
    mapping(address => Institution) public institutions;
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public registeredInstitutions;
    mapping(address => bytes32[]) public institutionCertificates;
    
    // Events
    event InstitutionRegistered(
        address indexed institutionAddress,
        string name,
        uint256 timestamp
    );
    
    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed institutionAddress,
        string recipientName,
        string courseName,
        uint256 timestamp
    );
    
    event CertificateVerified(
        bytes32 indexed certificateHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    event InstitutionVerified(
        address indexed institutionAddress,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier onlyRegisteredInstitution() {
        require(registeredInstitutions[msg.sender], "Only registered institutions can call this function");
        _;
    }
    
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address provided");
        _;
    }
    
    modifier certificateExists(bytes32 _certificateHash) {
        require(certificates[_certificateHash].isValid, "Certificate does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        totalCertificates = 0;
        totalInstitutions = 0;
    }
    
    /**
     * @dev Register a new educational institution
     * @param _name Name of the institution
     * @param _email Contact email of the institution
     * @param _physicalAddress Physical address of the institution
     */
    function registerInstitution(
        string memory _name,
        string memory _email,
        string memory _physicalAddress
    ) external {
        require(!registeredInstitutions[msg.sender], "Institution already registered");
        require(bytes(_name).length > 0, "Institution name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        institutions[msg.sender] = Institution({
            name: _name,
            email: _email,
            physicalAddress: _physicalAddress,
            walletAddress: msg.sender,
            isVerified: false,  // Requires manual verification by contract owner
            registeredAt: block.timestamp,
            certificatesIssued: 0
        });
        
        registeredInstitutions[msg.sender] = true;
        totalInstitutions++;
        
        emit InstitutionRegistered(msg.sender, _name, block.timestamp);
    }
    
    /**
     * @dev Verify an institution (only contract owner can call this)
     * @param _institutionAddress Address of the institution to verify
     */
    function verifyInstitution(address _institutionAddress) 
        external 
        onlyOwner 
        validAddress(_institutionAddress) 
    {
        require(registeredInstitutions[_institutionAddress], "Institution not registered");
        institutions[_institutionAddress].isVerified = true;
        
        emit InstitutionVerified(_institutionAddress, block.timestamp);
    }
    
    /**
     * @dev Issue a new certificate (only verified institutions can call this)
     * @param _recipientName Name of the certificate recipient
     * @param _courseName Name of the course/program
     * @param _completionDate Date when the course was completed
     * @param _grade Grade or score achieved (optional)
     */
    function issueCertificate(
        string memory _recipientName,
        string memory _courseName,
        string memory _completionDate,
        string memory _grade
    ) external onlyRegisteredInstitution returns (bytes32) {
        require(institutions[msg.sender].isVerified, "Institution must be verified to issue certificates");
        require(bytes(_recipientName).length > 0, "Recipient name cannot be empty");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_completionDate).length > 0, "Completion date cannot be empty");
        
        // Generate unique certificate hash
        bytes32 certificateHash = keccak256(abi.encodePacked(
            _recipientName,
            _courseName,
            _completionDate,
            msg.sender,
            block.timestamp,
            totalCertificates
        ));
        
        // Ensure certificate hash is unique
        require(!certificates[certificateHash].isValid, "Certificate hash collision detected");
        
        certificates[certificateHash] = Certificate({
            certificateHash: certificateHash,
            recipientName: _recipientName,
            courseName: _courseName,
            completionDate: _completionDate,
            grade: _grade,
            institutionAddress: msg.sender,
            issuedAt: block.timestamp,
            isValid: true
        });
        
        // Update counters
        totalCertificates++;
        institutions[msg.sender].certificatesIssued++;
        
        // Add to institution's certificate list
        institutionCertificates[msg.sender].push(certificateHash);
        
        emit CertificateIssued(
            certificateHash,
            msg.sender,
            _recipientName,
            _courseName,
            block.timestamp
        );
        
        return certificateHash;
    }
    
    /**
     * @dev Verify if a certificate is valid and authentic
     * @param _certificateHash Hash of the certificate to verify
     * @return bool True if certificate is valid, false otherwise
     */
    function verifyCertificate(bytes32 _certificateHash) 
        external 
        certificateExists(_certificateHash)
        returns (bool) 
    {
        emit CertificateVerified(_certificateHash, msg.sender, block.timestamp);
        return true;
    }
    
    /**
     * @dev Get certificate details by hash
     * @param _certificateHash Hash of the certificate
     * @return Certificate struct with all certificate details
     */
    function getCertificate(bytes32 _certificateHash) 
        external 
        view 
        certificateExists(_certificateHash)
        returns (Certificate memory) 
    {
        return certificates[_certificateHash];
    }
    
    /**
     * @dev Get institution details by address
     * @param _institutionAddress Address of the institution
     * @return Institution struct with all institution details
     */
    function getInstitution(address _institutionAddress) 
        external 
        view 
        validAddress(_institutionAddress)
        returns (Institution memory) 
    {
        require(registeredInstitutions[_institutionAddress], "Institution not found");
        return institutions[_institutionAddress];
    }
    
    /**
     * @dev Get all certificates issued by a specific institution
     * @param _institutionAddress Address of the institution
     * @return Array of certificate hashes
     */
    function getInstitutionCertificates(address _institutionAddress) 
        external 
        view 
        validAddress(_institutionAddress)
        returns (bytes32[] memory) 
    {
        require(registeredInstitutions[_institutionAddress], "Institution not found");
        return institutionCertificates[_institutionAddress];
    }
    
    /**
     * @dev Get contract statistics
     * @return totalInsts Total number of registered institutions
     * @return totalCerts Total number of issued certificates
     * @return contractOwner Address of the contract owner
     */
    function getContractStats() 
        external 
        view 
        returns (uint256 totalInsts, uint256 totalCerts, address contractOwner) 
    {
        return (totalInstitutions, totalCertificates, owner);
    }
    
    /**
     * @dev Check if an institution is registered and verified
     * @param _institutionAddress Address of the institution to check
     * @return isRegistered True if institution is registered
     * @return isVerified True if institution is verified
     */
    function checkInstitutionStatus(address _institutionAddress) 
        external 
        view 
        validAddress(_institutionAddress)
        returns (bool isRegistered, bool isVerified) 
    {
        isRegistered = registeredInstitutions[_institutionAddress];
        isVerified = isRegistered ? institutions[_institutionAddress].isVerified : false;
        return (isRegistered, isVerified);
    }
    
    /**
     * @dev Emergency function to invalidate a certificate (only owner)
     * @param _certificateHash Hash of the certificate to invalidate
     */
    function invalidateCertificate(bytes32 _certificateHash) 
        external 
        onlyOwner 
        certificateExists(_certificateHash)
    {
        certificates[_certificateHash].isValid = false;
    }
    
    /**
     * @dev Transfer ownership of the contract (only current owner)
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) 
        external 
        onlyOwner 
        validAddress(_newOwner) 
    {
        owner = _newOwner;
    }
    
    // Fallback function to reject direct Ether transfers
    receive() external payable {
        revert("This contract does not accept Ether");
    }
}