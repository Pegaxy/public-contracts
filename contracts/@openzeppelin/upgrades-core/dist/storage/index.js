"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageUpgradeErrors = exports.assertStorageUpgradeSafe = void 0;
const chalk_1 = __importDefault(require("chalk"));
__exportStar(require("./compat"), exports);
const error_1 = require("../error");
const layout_1 = require("./layout");
const compare_1 = require("./compare");
const overrides_1 = require("../validate/overrides");
const log_1 = require("../utils/log");
function assertStorageUpgradeSafe(original, updated, unsafeAllowCustomTypes = false) {
    const originalDetailed = layout_1.getDetailedLayout(original);
    const updatedDetailed = layout_1.getDetailedLayout(updated);
    const comparator = new compare_1.StorageLayoutComparator(unsafeAllowCustomTypes);
    const report = comparator.compareLayouts(originalDetailed, updatedDetailed);
    if (!overrides_1.isSilencingWarnings()) {
        if (comparator.hasAllowedUncheckedCustomTypes) {
            log_1.logWarning(`Potentially unsafe deployment`, [
                `You are using \`unsafeAllowCustomTypes\` to force approve structs or enums with missing data.`,
                `Make sure you have manually checked the storage layout for incompatibilities.`,
            ]);
        }
        else if (unsafeAllowCustomTypes) {
            console.error(chalk_1.default.keyword('yellow').bold('Note:') +
                ` \`unsafeAllowCustomTypes\` is no longer necessary. Structs are enums are automatically checked.\n`);
        }
    }
    if (!report.pass) {
        throw new StorageUpgradeErrors(report);
    }
}
exports.assertStorageUpgradeSafe = assertStorageUpgradeSafe;
class StorageUpgradeErrors extends error_1.UpgradesError {
    constructor(report) {
        super(`New storage layout is incompatible`, () => report.explain());
        this.report = report;
    }
}
// Kept for backwards compatibility and to avoid rewriting tests
function getStorageUpgradeErrors(original, updated, opts = {}) {
    try {
        assertStorageUpgradeSafe(original, updated, opts.unsafeAllowCustomTypes);
    }
    catch (e) {
        if (e instanceof StorageUpgradeErrors) {
            return e.report.ops;
        }
        else {
            throw e;
        }
    }
    return [];
}
exports.getStorageUpgradeErrors = getStorageUpgradeErrors;
//# sourceMappingURL=index.js.map