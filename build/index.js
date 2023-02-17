"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
require("dotenv/config");
const path = __importStar(require("path"));
const args_validation_1 = require("./functions/args_validation");
const logger_1 = require("./functions/logger");
const a = 'teste curve';
console.log(a);
console.log(process.env.USERNAME);
console.log(process.env.PASSWORD);
console.log(path.basename(__dirname));
logger_1.logger.info(`xxxx.csv file exists`);
logger_1.logger.warn(`xxxx.csv missing column`);
logger_1.logger.error(`xxxx.csv file does not exists`);
const args = (0, args_validation_1.args_validation)(process.argv.slice(2));
console.log(args.start_date);
//# sourceMappingURL=index.js.map