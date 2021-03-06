"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("./type-extensions");
const config_1 = require("hardhat/config");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const plugins_1 = require("hardhat/plugins");
config_1.subtask(task_names_1.TASK_COMPILE_SOLIDITY, async (args, hre, runSuper) => {
    const { readValidations, ValidationsCacheOutdated, ValidationsCacheNotFound } = await Promise.resolve().then(() => __importStar(require('./utils/validations')));
    try {
        await readValidations(hre);
    }
    catch (e) {
        if (e instanceof ValidationsCacheOutdated || e instanceof ValidationsCacheNotFound) {
            args = { ...args, force: true };
        }
        else {
            throw e;
        }
    }
    return runSuper(args);
});
config_1.subtask(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE, async (args, hre, runSuper) => {
    const { validate, solcInputOutputDecoder } = await Promise.resolve().then(() => __importStar(require('@openzeppelin/upgrades-core')));
    const { writeValidations } = await Promise.resolve().then(() => __importStar(require('./utils/validations')));
    // TODO: patch input
    const { output, solcBuild } = await runSuper();
    const { isFullSolcOutput } = await Promise.resolve().then(() => __importStar(require('./utils/is-full-solc-output')));
    if (isFullSolcOutput(output)) {
        const decodeSrc = solcInputOutputDecoder(args.input, output);
        const validations = validate(output, decodeSrc);
        await writeValidations(hre, validations);
    }
    return { output, solcBuild };
});
config_1.extendEnvironment(hre => {
    hre.upgrades = plugins_1.lazyObject(() => {
        const { silenceWarnings } = require('@openzeppelin/upgrades-core');
        const { makeDeployProxy } = require('./deploy-proxy');
        const { makeUpgradeProxy } = require('./upgrade-proxy');
        const { makePrepareUpgrade } = require('./prepare-upgrade');
        const { makeChangeProxyAdmin, makeTransferProxyAdminOwnership, makeGetInstanceFunction } = require('./admin');
        return {
            silenceWarnings,
            deployProxy: makeDeployProxy(hre),
            upgradeProxy: makeUpgradeProxy(hre),
            prepareUpgrade: makePrepareUpgrade(hre),
            admin: {
                getInstance: makeGetInstanceFunction(hre),
                changeProxyAdmin: makeChangeProxyAdmin(hre),
                transferProxyAdminOwnership: makeTransferProxyAdminOwnership(hre),
            },
        };
    });
});
//# sourceMappingURL=index.js.map