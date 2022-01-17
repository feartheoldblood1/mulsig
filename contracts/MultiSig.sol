pragma solidity >=0.5.0 <0.9.0;

import "./IERC20.sol";
import "./LBToken.sol";

///@title MultiSigWallet
///@author Peter
///@dev REFACTORING AND CHANGE LOGIC OF THE CODE
contract MultiSig is LBToken { 

    //addresses that can sign transactions
    mapping(address => uint) public _owners;      

    //transaction ID
    uint _txId = 1;
    uint8 countOwners;

    struct Transaction {
        address from;
        address to;
        uint tokens;
        uint8 countSign; 
    }
    
    mapping (address => uint) signature;
    mapping(uint => Transaction) private _transactions;
    
    uint[] _unsignedTransactions;  

    uint constant minCountSign = 2;

    //modifiers
    modifier lessThreeOwners() {
        require(countOwners < 3 && countOwners > 0, "adding is no more than two owners");
        _;
    }

    modifier isOwner() {
        require(_owners[msg.sender] == 1, "only owner is avaiable");
        _;
    }
    
    //events
    event TransactionCreated(address from, address to, uint amount, uint transactionId);
    event TransactionSigned(address by, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, uint transactionId);

    constructor() public {
        _owners[msg.sender] = 1;
        countOwners = 1;
    }

    function addOwner(address _newOwner) isOwner() lessThreeOwners() public {
        require(_newOwner != address(0), "'newOwner' can't be zero address");
        require(_newOwner != msg.sender, "'newOwner' can't be msg.sender");
        require(_owners[_newOwner] != 1, "'_newOwner' can't be existed owners");
        
        _owners[_newOwner] = 1;
        countOwners++;
    }

    function showOwners() public view returns(uint) {
        return countOwners;
    }

    function invest(uint _amount) public payable{
        balances[msg.sender] = balances[msg.sender] + _amount;
    }

    function createTransaction(address _to, uint _amount) isOwner() public payable{
        require(balanceOf(msg.sender) >= _amount, "'_amount' can't be more than balance");
        require(_to != address(0), "'_to' is zero address");

        uint transactionId = _txId;

        Transaction memory transaction;
        transaction.from = msg.sender;
        transaction.to = _to;
        transaction.tokens = _amount;
        transaction.countSign = 1;
        signature[msg.sender] = 1;

        _transactions[transactionId] = transaction;
        _unsignedTransactions.push(transactionId);
        _txId++;
        emit TransactionCreated(msg.sender, _to, _amount, transactionId);
    }

    function getUnsignedTransactions() view public returns (uint[] memory) {
        return _unsignedTransactions;
    }

    function signTransaction(address _signer, uint _transactionId) isOwner() public payable {
        require(_signer != address(0), "'_signer' is zero address");
        require(_transactionId != 0,"'_tranzactionId' is equal 0");
        require(_transactionId >= _unsignedTransactions.length, "'_transactionId' is more than length of '_unsignedTransactions'");
        require(_owners[_signer] == 1, "'owners' that cant sign a transaction");
        require(signature[_signer] != 1, "owners cant sign more than one time for one transaction");
        

        Transaction storage transaction = _transactions[_transactionId];

        signature[_signer] = 1;
        transaction.countSign++;   
        
        emit TransactionSigned(msg.sender, _transactionId); 
        
        if (transaction.countSign >= minCountSign) {
            require(balanceOf(msg.sender) >= transaction.tokens, "balance is more or equal to tokens' transaction");
            transfer(transaction.to, transaction.tokens);
            signature[_signer] = 0;
            emit TransactionCompleted(transaction.from, transaction.to, transaction.tokens, _transactionId);
            deleteTransaction(_transactionId);
        }
    }

    //don't resize unsgined transactions' array?
    function deleteTransaction(uint _transactionId) isOwner() private {
        require(_transactionId > 0, "'_transactionId' has to be more 0'");
        delete _unsignedTransactions[_transactionId - 1];
    }

}