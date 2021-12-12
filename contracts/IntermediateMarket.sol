// Add Notes

pragma solidity >=0.8.0 <0.9.0;

import "./SimpleMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntermediateEvents {

    // Compound Token counterpart has been added for this ERC20 token
    event tokenAdded(ERC20 _ERC20Contract);

    event valueUpdate(ERC20 _ERC20Contract);
   
}

contract IntermediateMarket is SimpleMarket, SupplyCompound, Ownable, IntermediateEvents {

    uint public last_token_id;

    address[] public acceptedTokens;

    struct totalValue {
        uint    totalMarket;
        uint    totalCommission;
    }

    mapping (ERC20 => totalValue) public ledger;

    mapping (ERC20 => ERC20) internal ERCtoCompound;

    mapping (ERC20 => ERC20) internal CompoundToERC;

    function totalMarket (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory marketValue = ledger[_ERC20Contract];
        return (marketValue.totalMarket);
    }

    function totalCommission (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory commissionValue = ledger[_ERC20Contract];
        return (commissionValue.totalCommission);
    }

    function totalToken (ERC20 _ERC20Contract) public view returns (uint) {
        uint totalToken = _ERC20Contract.balanceOf(address(this));
        return (totalToken);
    }

    function authorizeToken (ERC20 _ERC20Contract, ERC20 _cERC20Contract) onlyOwner public {
        require(ERCtoCompound[_ERC20Contract] == ERC20(address(0)));
        ERCtoCompound[_ERC20Contract] = _cERC20Contract;
        CompoundToERC[_cERC20Contract] = _ERC20Contract;

        acceptedTokens.push(address(_ERC20Contract));
        last_token_id ++;

        emit tokenAdded(_ERC20Contract);
    }

    // Upgrade original offer function
    function offer(
        uint pay_amt, 
        ERC20 pay_gem, 
        uint buy_amt, 
        ERC20 buy_gem
    )
        public
        override
        can_offer
        returns (uint id)
    {   
        // Increment the maker's offer by .1% commission and then call the original offer function from SimpleMarket with the added commission
        uint commission = uint(pay_amt/1000) + 1;
        id = super.offer(pay_amt + commission, pay_gem, buy_amt, buy_gem);
        
        // Offer is returned to original amount
        offers[id].pay_amt = pay_amt;
        
        // Commission is siphoned off to Compound Finance Protocol to gain interest
        supplyERC20ToCompound(address(pay_gem), address(ERCtoCompound[pay_gem]), commission);

        // Update state variables
        ledger[pay_gem].totalMarket += pay_amt;

        // Events
        emit valueUpdate(pay_gem);
    }

    // Upgrade original cancel function
    function cancel(uint id)
        public
        override
        returns (bool)
    {   
        // Call original function with outputs to update state
        ERC20 pay_gem = offers[id].pay_gem;
        uint pay_amt = offers[id].pay_amt;
        require(super.cancel(id));

        // Update state variables
        ledger[pay_gem].totalMarket -= pay_amt;

        // Events
        emit valueUpdate(pay_gem);
    }

    // Upgrade original buy function
    function buy(
        uint id, 
        uint quantity
    )
        public
        override
        returns (bool)
    {   
        // Call original function with outputs to update state
        super.buy(id, quantity);
        ERC20 pay_gem = offers[id].pay_gem;

        // Update state variables
        ledger[pay_gem].totalMarket -= quantity;

        // Events
        emit valueUpdate(pay_gem);
    }

    // Upgrade redeemERCTokens function to onlyOwner
    function redeemCERC20Tokens(
        uint256 amount,
        bool redeemType,
        address _cERC20Contract
    )   public
        override
        onlyOwner
        returns (bool) 
    {  
        // Call original function with outputs to update state
        super.redeemCERC20Tokens(amount, redeemType, _cERC20Contract);

        ERC20 cToken = ERC20(_cERC20Contract);
        ERC20 token = CompoundToERC[cToken];

        // Update state variables
        ledger[token].totalCommission = token.balanceOf(address(this)) - ledger[token].totalMarket;

        // Events
        emit valueUpdate(token);
        
    }

    function withdraw (
        ERC20 _ERC20Contract,
        uint _amount
    )   public
        onlyOwner
        returns (bool) 
    {
        require(_amount <= ledger[_ERC20Contract].totalCommission);

        ledger[_ERC20Contract].totalCommission -= _amount;
        _ERC20Contract.transfer(msg.sender, _amount);
    }

}
