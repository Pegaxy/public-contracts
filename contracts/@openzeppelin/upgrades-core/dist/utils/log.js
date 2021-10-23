"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = void 0;
const chalk_1 = __importDefault(require("chalk"));
const indent_1 = require("./indent");
function logWarning(title, lines = []) {
    const parts = [chalk_1.default.keyword('orange').bold('Warning:') + ' ' + title + '\n'];
    if (lines.length > 0) {
        parts.push(lines.map(l => indent_1.indent(l, 4) + '\n').join(''));
    }
    console.error(parts.join('\n'));
}
exports.logWarning = logWarning;
//# sourceMappingURL=log.js.map