"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const hardhat_1 = require("hardhat");
const validate_1 = require("./validate");
const src_decoder_1 = require("./src-decoder");
const test = ava_1.default;
test.before(async (t) => {
    t.context.validation = await [
        'contracts/test/Validations.sol:HasEmptyConstructor',
        'contracts/test/ValidationsNatspec.sol:HasNonEmptyConstructorNatspec1',
        'contracts/test/Proxiable.sol:ChildOfProxiable',
    ].reduce(async (validation, contract) => {
        const buildInfo = await hardhat_1.artifacts.getBuildInfo(contract);
        if (buildInfo === undefined) {
            throw new Error(`Build info not found for contract ${contract}`);
        }
        const solcOutput = buildInfo.output;
        const solcInput = buildInfo.input;
        const decodeSrc = src_decoder_1.solcInputOutputDecoder(solcInput, solcOutput);
        return Object.assign(await validation, validate_1.validate(solcOutput, decodeSrc));
    }, Promise.resolve({}));
});
let testCount = 0;
function testValid(name, kind, valid) {
    testOverride(name, kind, {}, valid);
}
function testOverride(name, kind, opts, valid) {
    const testName = name.concat(valid ? '_Allowed' : '_NotAllowed');
    test(`#${++testCount} ` + testName, t => {
        const version = validate_1.getContractVersion(t.context.validation, name);
        const assertUpgSafe = () => validate_1.assertUpgradeSafe([t.context.validation], version, { kind, ...opts });
        if (valid) {
            t.notThrows(assertUpgSafe);
        }
        else {
            t.throws(assertUpgSafe);
        }
    });
}
testValid('HasEmptyConstructor', 'transparent', true);
testValid('HasConstantStateVariableAssignment', 'transparent', true);
testValid('HasStateVariable', 'transparent', true);
testValid('UsesImplicitSafeInternalLibrary', 'transparent', true);
testValid('UsesExplicitSafeInternalLibrary', 'transparent', true);
testValid('HasNonEmptyConstructor', 'transparent', false);
testValid('ParentHasNonEmptyConstructor', 'transparent', false);
testValid('AncestorHasNonEmptyConstructor', 'transparent', false);
testValid('HasStateVariableAssignment', 'transparent', false);
testValid('HasImmutableStateVariable', 'transparent', false);
testValid('HasSelfDestruct', 'transparent', false);
testValid('HasDelegateCall', 'transparent', false);
testValid('ImportedParentHasStateVariableAssignment', 'transparent', false);
testValid('UsesImplicitUnsafeInternalLibrary', 'transparent', false);
testValid('UsesExplicitUnsafeInternalLibrary', 'transparent', false);
testValid('UsesImplicitUnsafeExternalLibrary', 'transparent', false);
testValid('UsesExplicitUnsafeExternalLibrary', 'transparent', false);
// Linked external libraries are not yet supported
// see: https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/52
testValid('UsesImplicitSafeExternalLibrary', 'transparent', false);
testValid('UsesExplicitSafeExternalLibrary', 'transparent', false);
test('inherited storage', t => {
    const version = validate_1.getContractVersion(t.context.validation, 'StorageInheritChild');
    const layout = validate_1.getStorageLayout([t.context.validation], version);
    t.is(layout.storage.length, 8);
    for (let i = 0; i < layout.storage.length; i++) {
        t.is(layout.storage[i].label, `v${i}`);
        t.truthy(layout.types[layout.storage[i].type]);
    }
});
testOverride('UsesImplicitSafeExternalLibrary', 'transparent', { unsafeAllowLinkedLibraries: true }, true);
testOverride('UsesExplicitSafeExternalLibrary', 'transparent', { unsafeAllowLinkedLibraries: true }, true);
testOverride('UsesImplicitSafeExternalLibrary', 'transparent', { unsafeAllow: ['external-library-linking'] }, true);
testOverride('UsesExplicitSafeExternalLibrary', 'transparent', { unsafeAllow: ['external-library-linking'] }, true);
testValid('HasEmptyConstructor', 'uups', false);
testValid('HasInternalUpgradeToFunction', 'uups', false);
testValid('HasUpgradeToFunction', 'uups', true);
testValid('ParentHasUpgradeToFunction', 'uups', true);
testValid('ChildOfProxiable', 'uups', true);
testValid('HasNonEmptyConstructorNatspec1', 'transparent', true);
testValid('HasNonEmptyConstructorNatspec2', 'transparent', true);
testValid('HasNonEmptyConstructorNatspec3', 'transparent', true);
testValid('HasNonEmptyConstructorNatspec4', 'transparent', true);
testValid('ParentHasNonEmptyConstructorNatspec1', 'transparent', true);
testValid('ParentHasNonEmptyConstructorNatspec2', 'transparent', true);
testValid('AncestorHasNonEmptyConstructorNatspec1', 'transparent', true);
testValid('AncestorHasNonEmptyConstructorNatspec2', 'transparent', true);
testValid('HasStateVariableAssignmentNatspec1', 'transparent', true);
testValid('HasStateVariableAssignmentNatspec2', 'transparent', true);
testValid('HasStateVariableAssignmentNatspec3', 'transparent', false);
testValid('HasImmutableStateVariableNatspec1', 'transparent', true);
testValid('HasImmutableStateVariableNatspec2', 'transparent', true);
testValid('HasImmutableStateVariableNatspec3', 'transparent', false);
testValid('HasSelfDestructNatspec1', 'transparent', true);
testValid('HasSelfDestructNatspec2', 'transparent', true);
testValid('HasSelfDestructNatspec3', 'transparent', true);
testValid('HasDelegateCallNatspec1', 'transparent', true);
testValid('HasDelegateCallNatspec2', 'transparent', true);
testValid('HasDelegateCallNatspec3', 'transparent', true);
testValid('ImportedParentHasStateVariableAssignmentNatspec1', 'transparent', true);
testValid('ImportedParentHasStateVariableAssignmentNatspec2', 'transparent', true);
testValid('UsesImplicitSafeInternalLibraryNatspec', 'transparent', true);
testValid('UsesImplicitSafeExternalLibraryNatspec', 'transparent', true);
testValid('UsesImplicitUnsafeInternalLibraryNatspec', 'transparent', true);
testValid('UsesImplicitUnsafeExternalLibraryNatspec', 'transparent', true);
testValid('UsesExplicitSafeInternalLibraryNatspec', 'transparent', true);
testValid('UsesExplicitSafeExternalLibraryNatspec', 'transparent', true);
testValid('UsesExplicitUnsafeInternalLibraryNatspec', 'transparent', true);
testValid('UsesExplicitUnsafeExternalLibraryNatspec', 'transparent', true);
//# sourceMappingURL=validate.test.js.map