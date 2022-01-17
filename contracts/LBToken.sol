pragma solidity >=0.5.0 <0.9.0;

import "./IERC20.sol";

contract LBToken is IERC20 {
    
    string public constant name = "LBToken";
    string public constant symbol = "LBT";
    uint8 public constant decimals = 0;

    address owner;

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint)) allowed;

    uint256 totalSupply_ = 10000000;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public view returns (uint) {
        return totalSupply_;
    }

    function balanceOf(address _tokenOwner) public view returns (uint) {
        return balances[_tokenOwner];
    }

    function transfer(address _receiver, uint _numTokens) public returns (bool) {
        require(_numTokens <= balances[msg.sender], "number of tokens has to be more than balances of the sender");
        require(_receiver != address(0), "receiver cannot be zero address");
        require(_receiver != msg.sender, "sender cannot send transfer tokens himself");
        require(_numTokens >= 0, "'_numTokens' has to be more or equal zero");
        balances[msg.sender] = balances[msg.sender] - _numTokens;
        balances[_receiver] = balances[_receiver] + _numTokens;
        emit Transfer(msg.sender, _receiver, _numTokens);
        return true;
    }

    function approve(address _delegate, uint _numTokens) public returns (bool) {
        require(_numTokens >= 0, "no way to negative amount of tokens");
        allowed[msg.sender][_delegate] = _numTokens;
        emit Approval(msg.sender, _delegate, _numTokens);
        return true;
    }

    function allowance(address _owner, address _delegate) public view returns (uint) {
        return allowed[_owner][_delegate];
    }

    function transferFrom(address _owner, address _buyer, uint _numTokens) onlyOwner() public returns (bool) {
        require(_numTokens <= balances[_owner], "number of tokens has to be more than balances of the sender");
        require(_numTokens <= allowed[_owner][msg.sender], "number of tokens has to be more than balances of the allowed sender");
        require(_owner != address(0), "'_owner' is cannot be zero address");
        require(_buyer != address(0), "'_buyer' cannot be zero address");
        require(_numTokens >= 0, "'_numTokens' has to be more or equal zero");
        balances[_owner] = balances[_owner] - _numTokens;
        allowed[_owner][msg.sender] = allowed[_owner][msg.sender] - _numTokens;
        balances[_buyer] = balances[_buyer] - _numTokens;
        emit Transfer(_owner, _buyer, _numTokens);
        return true;
    }
}