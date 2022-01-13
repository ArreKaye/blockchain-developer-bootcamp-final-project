// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.10;

import "./SimpleMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title An on-chain order book
/// @author Ryan Kwak
/// @notice Adds commissions and Compound Finance integration to the MakerDAO SimpleMarket.sol contract
/// @dev 
contract IntermediateMarket is SimpleMarket, SupplyCompound, Ownable {

    /// @notice Emitted when a token is authorized for use in the market
    /// @param _ERC20Contract is the ERC20 contract address
    event tokenAdded(ERC20 _ERC20Contract);

    /// @notice Emitted when the public mapping ledger has been updated
    /// @param _ERC20Contract is the ERC20 contract address
    event valueUpdate(ERC20 _ERC20Contract);

    /// @dev Used to determine the length of the array acceptedTokens
    uint public last_token_id;

    /// @dev Lets users know which tokens have been authorized for trading, for the frontend
    address[] public acceptedTokens;

    struct totalValue {
        uint    totalMarket;
        uint    totalCommission;
    }

    mapping (ERC20 => totalValue) public ledger;

    mapping (ERC20 => ERC20) internal ERCtoCompound;

    mapping (ERC20 => ERC20) internal CompoundToERC;

    /// @notice Views the tradeable amount of token in the market
    /// @param _ERC20Contract is the ERC20 contract address
    /// @return Returns the token value
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    function totalMarket (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory marketValue = ledger[_ERC20Contract];
        return (marketValue.totalMarket);
    }

    /// @notice Views the total commission stored in the contract
    /// @param _ERC20Contract is the ERC20 contract address
    /// @return Returns the token value
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @dev Commission = 0 until compound equivalent tokens are redeemed
    function totalCommission (ERC20 _ERC20Contract) public view returns (uint) {
        totalValue memory commissionValue = ledger[_ERC20Contract];
        return (commissionValue.totalCommission);
    }

    /// @notice Views the total token stored in the contract
    /// @param _ERC20Contract is the ERC20 contract address
    /// @return Returns the token value
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @dev tradeable market + commission
    function totalToken (ERC20 _ERC20Contract) public view returns (uint) {
        uint totalToken = _ERC20Contract.balanceOf(address(this));
        return (totalToken);
    }

    /// @notice Enables an ERC20 token to be traded in the market
    /// @param _ERC20Contract is the ERC20 contract address
    /// @param _cERC20Contract is the ERC20 contract address of the Compound token
    /// @dev Market must be initiated with at least two pairs of ERC20 to cERC20 authorizations
    function authorizeToken (ERC20 _ERC20Contract, ERC20 _cERC20Contract) onlyOwner public {
        require(ERCtoCompound[_ERC20Contract] == ERC20(address(0)));
        ERCtoCompound[_ERC20Contract] = _cERC20Contract;
        CompoundToERC[_cERC20Contract] = _ERC20Contract;

        acceptedTokens.push(address(_ERC20Contract));
        last_token_id ++;

        emit tokenAdded(_ERC20Contract);
    }

    /// @notice Upgrades the original make offer function with a commission that is sent to Compound
    /// @param pay_amt is the amount of the sell token
    /// @param pay_gem is the ERC20 contract address of the sell token
    /// @param buy_amt is the amount of buy token
    /// @param buy_gem is the ERC20 contract address of the buy token
    /// @return id returns the offer id
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @dev The 0.1% commission is taken with the offer, but the actual offer contents are unaffected
    /// @inheritdoc SimpleMarket
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

    /// @notice Upgrades the original cancel function
    /// @param id the offer id
    /// @return Returns true when all conditions are met for user to cancel the offer
    /// @dev Originally designed to be called in the kill function of SimpleMarket, but not used in this contract
    /// @inheritdoc SimpleMarket
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

    /// @notice Upgrades the original buy function with a commission that is sent to Compound
    /// @param id is the offer id
    /// @param quantity is the amount of the sell token to take
    /// @return Returns success when conditions are met for a successful transaction
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @dev The 0.2% commission is taken with the buy, but the actual offer ratios are unaffected
    /// @inheritdoc SimpleMarket
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
        ERC20 buy_gem = offers[id].buy_gem;

        // Charge .2% commission and transfer to compound
        uint commission = uint(quantity/500) + 1;
        safeTransferFrom(buy_gem, msg.sender, address(this), commission);
        supplyERC20ToCompound(address(buy_gem), address(ERCtoCompound[buy_gem]), commission);

        // Update state variables
        ledger[pay_gem].totalMarket -= quantity;

        // Events
        emit valueUpdate(pay_gem);
    }

    /// @notice Upgrades original redeemERCTokens function to onlyOwner
    /// @param amount Value of selected token to redeem
    /// @param redeemType True for amount in cToken, False for amount in underlying Token
    /// @param _cERC20Contract is the ERC20 contract address of the Compound token
    /// @return Returns success when conditions are met for a successful transfer
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @inheritdoc SupplyCompound
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
    /// @notice Allows contract owner to transfer earned commissions out of the contract
    /// @param _ERC20Contract is the ERC20 contract address
    /// @param _amount is the value of the selected token to withdraw
    /// @return Returns success when conditions are met for a successful transfer
    /// @dev Token value scaled up by the ERC20 variable 'decimals'
    /// @dev Includes interest earned from Compound when redeemERC20Tokens has been called beforehand
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
