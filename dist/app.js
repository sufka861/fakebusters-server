"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//app.ts
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sampleRoutes_1 = __importDefault(require("./routes/sampleRoutes"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const logPath = path_1.default.join(__dirname, '../logs', 'http.log');
app.use((0, morgan_1.default)(':date --> :method :url :status :response-time ms', {
    stream: fs_1.default.createWriteStream(logPath, { flags: 'a' }),
}));
app.use((0, cors_1.default)());
app.use('/api', sampleRoutes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map