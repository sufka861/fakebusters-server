"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorLogger_1 = __importDefault(require("./loggers/errorLogger"));
const errorHandler = (error, req, res) => {
    console.log(error);
    errorLogger_1.default.error(error === null || error === void 0 ? void 0 : error.message);
    res.status(error.status || 500);
    res.json({ message: error.message || 'Internal Server Error' });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map