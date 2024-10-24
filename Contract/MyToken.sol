// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing the ERC721 standard implementation and Ownable contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// The RealEstateToken contract inherits from ERC721 and Ownable
contract RealEstateToken is ERC721, Ownable {
    // Structure to represent a property
    struct Property {
        uint256 id; // Unique identifier for the property
        string addressInfo; // Address information of the property
        uint256 yearBuilt; // Year the property was built
        uint256 lotSize; // Size of the lot in square units
        uint256 numberOfRooms; // Number of rooms in the property
        uint256 price; // Price of the property
    }

    // Structure to represent a voting proposal
    struct Proposal {
        uint256 id; // Unique identifier for the proposal
        string description; // Description of the proposal
        uint256 forVotes; // Number of votes in favor
        uint256 againstVotes; // Number of votes against
        bool executed; // Indicates if the proposal has been executed
        uint256 creationTime; // Timestamp when the proposal was created
        mapping(address => bool) hasVoted; // Tracks if an address has voted
    }

    // Mappings to store properties and proposals
    mapping(uint256 => Property) public properties; // Maps property ID to Property
    mapping(uint256 => Proposal) public proposals; // Maps proposal ID to Proposal
    uint256 public propertyCount; // Counter for the number of properties
    uint256 public proposalCount; // Counter for the number of proposals
    uint256 public constant VOTING_PERIOD = 7 days; // Duration for voting on proposals

    // Events to log significant actions
    event PropertyListed(uint256 indexed id, string addressInfo, uint256 price);
    event TokensPurchased(address indexed buyer, uint256 indexed propertyId);
    event TokensSold(address indexed seller, uint256 indexed propertyId);
    event DividendDistributed(uint256 indexed propertyId, uint256 amount);
    event ProposalCreated(uint256 indexed id, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool inFavor);
    event ProposalExecuted(uint256 indexed proposalId);
    event TokenMinted(uint256 indexed propertyId, address indexed to);
    event TokenBurned(uint256 indexed propertyId);

    // Constructor to initialize the ERC721 token with a name and symbol
    constructor() ERC721("RealEstateToken", "RET") Ownable(msg.sender) {}

    // Function to list a new property
    function listProperty(
        string calldata _addressInfo,
        uint256 _yearBuilt,
        uint256 _lotSize,
        uint256 _numberOfRooms,
        uint256 _price
    ) external onlyOwner {
        propertyCount++; // Increment the property count
        // Create a new Property and store it in the mapping
        properties[propertyCount] = Property({
            id: propertyCount,
            addressInfo: _addressInfo,
            yearBuilt: _yearBuilt,
            lotSize: _lotSize,
            numberOfRooms: _numberOfRooms,
            price: _price
        });
        _mint(address(this), propertyCount); // Mint a new token for the property
        emit PropertyListed(propertyCount, _addressInfo, _price); // Emit event
    }

    // Function to mint a token for a property
    function mintToken(uint256 _propertyId, address _to) external onlyOwner {
        require(properties[_propertyId].id != 0, "Property does not exist"); // Check if property exists
        _mint(_to, _propertyId); // Mint the token to the specified address
        emit TokenMinted(_propertyId, _to); // Emit event
    }

    // Function to burn a token for a property
    function burnToken(uint256 _propertyId) external onlyOwner {
        require(ownerOf(_propertyId) == msg.sender, "Not the token owner"); // Check ownership
        _burn(_propertyId); // Burn the token
        emit TokenBurned(_propertyId); // Emit event
    }

    // Function to buy a token for a property
    function buyToken(uint256 _propertyId) external payable {
        Property storage property = properties[_propertyId]; // Get the property
        require(property.id != 0, "Property does not exist"); // Check if property exists
        require(msg.value == property.price, "Incorrect payment amount"); // Check payment amount

        _transfer(address(this), msg.sender, _propertyId); // Transfer the token to the buyer
        emit TokensPurchased(msg.sender, _propertyId); // Emit event
    }

    // Function to sell a token for a property
    function sellToken(uint256 _propertyId) external {
        require(ownerOf(_propertyId) == msg.sender, "Not the token owner"); // Check ownership
        _transfer(msg.sender, address(this), _propertyId); // Transfer the token back to the contract
        payable(msg.sender).transfer(properties[_propertyId].price); // Pay the seller
        emit TokensSold(msg.sender, _propertyId); // Emit event
    }

    // Function to create a new proposal
    function createProposal(string calldata _description) external onlyOwner {
        proposalCount++; // Increment the proposal count
        Proposal storage newProposal = proposals[proposalCount]; // Create a new proposal
        newProposal.id = proposalCount; // Set the proposal ID
        newProposal.description = _description; // Set the proposal description
        newProposal.creationTime = block.timestamp; // Set the creation time
        emit ProposalCreated(proposalCount, _description); // Emit event
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalId, bool _inFavor) external {
        Proposal storage proposal = proposals[_proposalId]; // Get the proposal
        require(proposal.id != 0, "Proposal does not exist"); // Check if proposal exists
        require(!proposal.hasVoted[msg.sender], "Already voted"); // Check if the voter has already voted
        require(!proposal.executed, "Proposal already executed"); // Check if the proposal has been executed
        require(
            block.timestamp <= proposal.creationTime + VOTING_PERIOD,
            "Voting period has ended" // Check if the voting period is still open
        );

        uint256 voteWeight = balanceOf(msg.sender); // Get the voter's token balance as vote weight
        if (_inFavor) {
            proposal.forVotes += voteWeight; // Increment votes in favor
        } else {
            proposal.againstVotes += voteWeight; // Increment votes against
        }

        proposal.hasVoted[msg.sender] = true; // Mark the voter as having voted
        emit Voted(_proposalId, msg.sender, _inFavor); // Emit event
    }

    // Function to execute a proposal
    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId]; // Get the proposal
        require(proposal.id != 0, "Proposal does not exist"); // Check if proposal exists
        require(!proposal.executed, "Proposal already executed"); // Check if the proposal has been executed
        require(
            block.timestamp > proposal.creationTime + VOTING_PERIOD,
            "Voting period has not ended" // Check if the voting period has ended
        );

        if (proposal.forVotes > proposal.againstVotes) {
            proposal.executed = true; // Mark the proposal as executed
            emit ProposalExecuted(_proposalId); // Emit event
        }
    }

    // Function to distribute dividends to property owners
    function distributeDividends(uint256 _propertyId) external payable onlyOwner {
        require(ownerOf(_propertyId) != address(0), "Property does not exist"); // Check if property exists
        require(msg.value > 0, "Dividend amount must be greater than 0"); // Check if dividend amount is valid

        address tokenOwner = ownerOf(_propertyId); // Get the owner of the property
        payable(tokenOwner).transfer(msg.value); // Transfer the dividend to the owner
        emit DividendDistributed(_propertyId, msg.value); // Emit event
    }

    // Function to calculate rewards based on years owned
    function calculateRewards(uint256 _propertyId, uint256 _yearsOwned)
        external
        view
        returns (uint256)
    {
        require(ownerOf(_propertyId) != address(0), "Property does not exist"); // Check if property exists
        return (_yearsOwned + 1) / 100; // Calculate rewards based on years owned
    }

    // Internal function to generate metadata for a property
    function _generateMetadata(Property memory property)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"name":"',
                    property.addressInfo,
                    '", "description":"Real estate property located at ',
                    property.addressInfo,
                    '", "attributes":[',
                    _generateAttributes(property),
                    "]}"
                )
            );
    }

    // Internal function to generate attributes for a property
    function _generateAttributes(Property memory property)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Year Built", "value":',
                    _uint2str(property.yearBuilt),
                    '},',
                    '{"trait_type":"Lot Size", "value":',
                    _uint2str(property.lotSize),
                    '},',
                    '{"trait_type":"Number of Rooms", "value":',
                    _uint2str(property.numberOfRooms),
                    '},',
                    '{"trait_type":"Price", "value":',
                    _uint2str(property.price),
                    "}"
                )
            );
    }

    // Function to get the token URI for a property
    function tokenURI(uint256 _propertyId)
        public
        view
        override
        returns (string memory)
    {
        address owner = ownerOf(_propertyId); // Get the owner of the token
        require(
            owner != address(0),
            "ERC721Metadata: URI query for nonexistent token" // Check if the token exists
        );

        Property memory property = properties[_propertyId]; // Get the property
        string memory metadata = _generateMetadata(property); // Generate metadata
        
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    _encodeBase64(bytes(metadata)) // Encode metadata in Base64
                )
            );
    }

    // Internal function to convert uint256 to string
    function _uint2str(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0"; // Return "0" if the value is zero
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++; // Count the number of digits
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); // Convert each digit to its ASCII representation
            value /= 10;
        }
        return string(buffer); // Return the string representation
    }

    // Internal function to encode data in Base64
    function _encodeBase64(bytes memory data)
        internal
        pure
        returns (string memory)
    {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = 4 * ((data.length + 2) / 3); // Calculate the length of the Base64 encoded string
        string memory result = new string(len);
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            let dataPtr := add(data, 32)
            let endPtr := add(dataPtr, mload(data))
            for {

            } lt(dataPtr, endPtr) {

            } {
                let input := mload(dataPtr)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F)))) // Encode the first 6 bits
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F)))) // Encode the second 6 bits
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F)))) // Encode the third 6 bits
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F)))) // Encode the last 6 bits
                resultPtr := add(resultPtr, 1)
                dataPtr := add(dataPtr, 3) // Move to the next 3 bytes
            }
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 2), 0x3d) // Add padding for Base64
                mstore8(sub(resultPtr, 1), 0x3d)
            }
            case 2 { mstore8(sub(resultPtr, 1), 0x3d) }
        }
        return result; // Return the Base64 encoded string
    }
}