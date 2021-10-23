import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import { ValidationOptions } from '@openzeppelin/upgrades-core';
export declare type UpgradeFunction = (proxyAddress: string, ImplFactory: ContractFactory, opts?: ValidationOptions) => Promise<Contract>;
export declare function makeUpgradeProxy(hre: HardhatRuntimeEnvironment): UpgradeFunction;
//# sourceMappingURL=upgrade-proxy.d.ts.map