"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionSignature = void 0;
const assert_1 = require("./assert");
function serializeTypeName(typename, deref) {
    assert_1.assert(!!typename);
    switch (typename.nodeType) {
        case 'ArrayTypeName':
        case 'ElementaryTypeName': {
            assert_1.assert(typeof typename.typeDescriptions.typeString === 'string');
            return typename.typeDescriptions.typeString;
        }
        case 'UserDefinedTypeName': {
            const userDefinedType = deref(['StructDefinition', 'EnumDefinition', 'ContractDefinition'], typename.referencedDeclaration);
            switch (userDefinedType.nodeType) {
                case 'StructDefinition':
                    return '(' + userDefinedType.members.map(member => serializeTypeName(member.typeName, deref)) + ')';
                case 'EnumDefinition':
                    assert_1.assert(userDefinedType.members.length < 256);
                    return 'uint8';
                case 'ContractDefinition':
                    return 'address';
                default:
                    assert_1.assertUnreachable(userDefinedType);
            }
        }
        // eslint-disable-next-line no-fallthrough
        default:
            throw new Error(`Unsuported TypeName node type: ${typename.nodeType}`);
    }
}
function getFunctionSignature(fnDef, deref) {
    return `${fnDef.name}(${fnDef.parameters.parameters
        .map(parameter => serializeTypeName(parameter.typeName, deref))
        .join()})`;
}
exports.getFunctionSignature = getFunctionSignature;
//# sourceMappingURL=function.js.map