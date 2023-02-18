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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const csv_writer_1 = require("csv-writer");
const fs_1 = require("fs");
const moment_1 = __importDefault(require("moment"));
const path_1 = require("path");
const args_validation_1 = require("./functions/args_validation");
const date_validation = __importStar(require("./functions/date_validation"));
const logger_1 = require("./functions/logger");
const sharepoint_1 = require("./functions/sharepoint");
const current_1 = __importDefault(require("./functions/sla/current"));
const curve_forward_energy_1 = __importDefault(require("./functions/sla/curve_forward_energy"));
const voltage_1 = __importDefault(require("./functions/sla/voltage"));
const whitelist_1 = __importDefault(require("./functions/sla/whitelist"));
process.on('uncaughtException', err => {
    if (err.stack !== undefined)
        logger_1.logger.error(err.stack, () => process.exit(1));
    else
        logger_1.logger.error(`${err.name}: ${err.message}`, () => process.exit(1));
});
const check_args = () => {
    const args = (0, args_validation_1.args_validation)(process.argv.slice(2));
    const day = args.day.trim();
    return Promise.resolve(day);
};
const check_date = (day) => {
    const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
    date_validation.check_date_format(day);
    date_validation.check_if_date_is_greater_than(day, yesterday);
    return Promise.resolve(day);
};
const insert_meterno_in_main_result = (obj, main_result) => {
    for (const key of Object.keys(obj))
        main_result[key] = {
            curve_forward_energy: 0.0,
            current: 0.0,
            status: '',
            voltage: 0.0
        };
};
const insert_values_in_main_result = (column, obj, main_result) => {
    for (const [key, value] of Object.entries(obj))
        if (column == 'curve_forward_energy')
            main_result[key]['curve_forward_energy'] = Number(value);
        else if (column == 'voltage')
            main_result[key]['voltage'] = Number(value);
        else if (column == 'current')
            main_result[key]['current'] = Number(value);
        else if (column == 'status')
            main_result[key]['status'] = value;
};
(async () => {
    const day = await check_args();
    await check_date(day);
    const main_result = {};
    const curve_forward_energy = await (0, curve_forward_energy_1.default)(day);
    insert_meterno_in_main_result(curve_forward_energy, main_result);
    const voltage = await (0, voltage_1.default)(day);
    insert_meterno_in_main_result(voltage, main_result);
    const current = await (0, current_1.default)(day);
    insert_meterno_in_main_result(current, main_result);
    const whitelist = await (0, whitelist_1.default)(day);
    insert_meterno_in_main_result(whitelist, main_result);
    insert_values_in_main_result('curve_forward_energy', curve_forward_energy, main_result);
    insert_values_in_main_result('voltage', voltage, main_result);
    insert_values_in_main_result('current', current, main_result);
    insert_values_in_main_result('status', whitelist, main_result);
    const sla_result_file = process.env['CSV_SLA_FILE_NAME'].replace('YYYY-MM-DD', day);
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        header: [
            { id: 'date', title: 'Date' },
            { id: 'meterno', title: 'Name' },
            { id: 'curve_forward_energy', title: 'Curve_Forward_Energy' },
            { id: 'current', title: 'Current' },
            { id: 'status', title: 'Status' },
            { id: 'voltage', title: 'Voltage' }
        ],
        path: sla_result_file
    });
    const records = [];
    for (const [key, value] of Object.entries(main_result))
        records.push({
            date: day,
            meterno: key,
            curve_forward_energy: value.curve_forward_energy,
            voltage: value.voltage,
            current: value.current,
            status: value.status
        });
    if (!(0, fs_1.existsSync)(sla_result_file))
        (0, fs_1.closeSync)((0, fs_1.openSync)(sla_result_file, 'w'));
    csvWriter
        .writeRecords(records) // returns a promise
        .then(() => {
        console.log('...Done');
    })
        .then(() => {
        (0, sharepoint_1.sharepoint_upload)(sla_result_file, (0, path_1.join)(process.env.SHAREPOINT_CEMIG_SLA_ROOT_FOLDER, process.env.SHAREPOINT_CEMIG_SLA_RESULT_FOLDER), sla_result_file);
    });
})();
//# sourceMappingURL=index.js.map