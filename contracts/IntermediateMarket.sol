// Add Notes

pragma solidity >=0.8.0 <0.9.0;

import "./SimpleMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntermediateEvents {

    // Compound Token counterpart has been added for this ERC20 token
   event cTokenAdded(ERC20 _ERC20Contract);

   event marketAdd(ERC20 _ERC20Contract, uint value);

   event commissionAdd(ERC20 _ERC20Contract, uint value);

   event compoundAdd(ERC20 _ERC20Contract, uint value);
   
}

contract IntermediateMarket is SimpleMarket, SupplyCompound, Ownable, IntermediateEvents {

    struct totalValue {
        uint    totalMarket;
        uint    totalCommission;
        uint    totalCompound;
    }

    mapping(ERC20 => totalValue) public ledger;

    mapping (ERC20 => ERC20) internal ERCtoCompound;

    function totalMarket (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory marketValue = ledger[_ERC20Contract];
        return (marketValue.totalMarket);
    }

    function totalCommission (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory commissionValue = ledger[_ERC20Contract];
        return (commissionValue.totalCommission);
    }

    function totalCompound (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory compoundValue = ledger[_ERC20Contract];
        return (compoundValue.totalCompound);
    }

    function addCTokenAddress (ERC20 _ERC20Contract, ERC20 _cERC20Contract) public {
        require(ERCtoCompound[_ERC20Contract] == ERC20(address(0)));
        ERCtoCompound[_ERC20Contract] = _cERC20Contract;
        emit cTokenAdded(_ERC20Contract);
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
        returns (uint id)
    {   
        // Increment the maker's offer by .01% commission and then call the original offer function from SimpleMarket with the added commission
        uint commission = uint(pay_amt/10000);
        pay_amt = pay_amt + commission;
        id = super.offer(pay_amt, pay_gem, buy_amt, buy_gem);

        // Offer is rebased to original amount
        offers[id].pay_amt = pay_amt - commission;
        
        // Commission is siphoned off to Compound Finance Protocol to gain interest
        supplyERC20ToCompound(address(pay_gem), address(ERCtoCompound[pay_gem]), commission);
    
    }  

    // Upgrade redeemERCTokens function 
    function redeemCERC20Tokens(
        uint256 amount,
        bool redeemType,
        address _cERC20Contract
    )   public
        override
        onlyOwner
        returns (bool) {
        
        
        // // Create a reference to the corresponding cToken contract, like cDAI
        // CERC20 cToken = CERC20(_cERC20Contract);

        // // `amount` is scaled up, see decimal table here:
        // // https://compound.finance/docs#protocol-math

        // uint256 redeemResult;

        // if (redeemType == true) {
        //     // Retrieve your asset based on a cToken amount
        //     redeemResult = cToken.redeem(amount);
        // } else {
        //     // Retrieve your asset based on an amount of the asset
        //     redeemResult = cToken.redeemUnderlying(amount);
        // }

        // // Error codes are listed here:
        // // https://compound.finance/docs/ctokens#error-codes
        // emit MyLog("If this is not 0, there was an error", redeemResult);

        // return true;
    }

    function withdraw (
        address _TokenAddress,
        uint amount
    ) public
      onlyOwner
      returns (bool) {

      }

}
