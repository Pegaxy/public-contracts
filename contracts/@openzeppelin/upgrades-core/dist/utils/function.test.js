"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const hardhat_1 = require("hardhat");
const utils_1 = require("solidity-ast/utils");
const function_1 = require("./function");
const ast_dereferencer_1 = require("../ast-dereferencer");
const test = ava_1.default;
test.before(async (t) => {
    const fileName = 'contracts/test/FunctionSignatures.sol';
    const contractName = 'FunctionSignatures';
    const buildInfo = await hardhat_1.artifacts.getBuildInfo(`${fileName}:${contractName}`);
    if (buildInfo === undefined) {
        throw new Error('Build info not found');
    }
    const solcOutput = buildInfo.output;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.context.signatures = Object.keys(solcOutput.contracts[fileName][contractName].evm.methodIdentifiers);
    t.context.functions = {};
    for (const def of utils_1.findAll('FunctionDefinition', solcOutput.sources[fileName].ast)) {
        t.context.functions[def.name] = def;
    }
    t.context.deref = ast_dereferencer_1.astDereferencer(solcOutput);
});
test('signatures', t => {
    for (const signature of t.context.signatures) {
        const name = signature.replace(/\(.*/, '');
        t.is(function_1.getFunctionSignature(t.context.functions[name], t.context.deref), signature);
    }
});
//# sourceMappingURL=function.test.js.map