import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory } from 'ethers';
import { ValidationOptions } from '@openzeppelin/upgrades-core';
export declare type PrepareUpgradeFunction = (proxyAddress: string, ImplFactory: ContractFactory, opts?: ValidationOptions) => Promise<string>;
export declare function makePrepareUpgrade(hre: HardhatRuntimeEnvironment): PrepareUpgradeFunction;
//# sourceMappingURL=prepare-upgrade.d.ts.map