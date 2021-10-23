// contracts/PGXVesting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./@openzeppelin/contracts/access/AccessControl.sol";

contract PGXVesting is AccessControl {
    address private pgxAddress;

    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");

    event Released(uint256 amount);

    // address of investor/team/...
    address private _beneficiary;

    uint256 private _cliff;
    uint256 private _start;
    uint256 private _duration;

    uint256 private _releaseTGE;

    //Total PGX released for investor/team/...
    uint256 private _released;

    constructor (address beneficiary, uint256 start, uint256 releaseTGE, uint256 cliffDuration, uint256 duration) {
        require(beneficiary != address(0), "PGXVesting: beneficiary is the zero address");
        require(cliffDuration <= duration, "PGXVesting: cliff is longer than duration");
        require(duration > 0, "PGXVesting: duration is 0");
        require(start + duration > block.timestamp, "PGXVesting: ended before current time");

        _beneficiary = beneficiary;
        _duration = duration;
        _cliff = start + cliffDuration;
        _start = start;
        _releaseTGE = releaseTGE;

        _setRoleAdmin(DEPLOYER_ROLE, DEPLOYER_ROLE);
        _setupRole(DEPLOYER_ROLE, msg.sender);
    }

    function setPGX(address pgx) public onlyRole(DEPLOYER_ROLE) {
        require(pgx != address(0), "PGXVesting: PGX address is invalid");
        require(address(pgxAddress) == address(0), "PGXVesting: PGX address is setted");
        pgxAddress = pgx;

        if (_releaseTGE > 0) {
            _released = _released + _releaseTGE;
            
            IERC20(pgxAddress).transfer(_beneficiary, _releaseTGE);

            emit Released(_releaseTGE);
        }
    }

    function getBeneficiary() public view returns (address) {
        return _beneficiary;
    }

    function getCliff() public view returns (uint256) {
        return _cliff;
    }

    function getStart() public view returns (uint256) {
        return _start;
    }

    function getDuration() public view returns (uint256) {
        return _duration;
    }

    function getReleased() public view returns (uint256) {
        return _released;
    }

    function release() public {
        require(_beneficiary != address(0), "PGXVesting: no beneficiary to release");
        uint256 unreleased = _releasableAmount();

        require(unreleased > 0, "PGXVesting: no PGX to release this time");

        _released = _released + unreleased;

        IERC20(pgxAddress).transfer(_beneficiary, unreleased);

        emit Released(unreleased);
    }

    function _releasableAmount() private view returns (uint256) {
        return (_vestableAmount() - _released);
    }
  
    function _vestableAmount() private view returns (uint256) {
        uint256 currentBalance = IERC20(pgxAddress).balanceOf(address(this));
        uint256 totalBalance = currentBalance + _released;

        if (block.timestamp < _cliff) {
            return 0;
        } else if (block.timestamp >= (_start + _duration)) {
            return totalBalance;
        } else {
            return totalBalance * (block.timestamp - _start) / _duration;
        }
    }
}