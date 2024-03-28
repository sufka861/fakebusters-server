"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, simple } = winston_1.format;
const logger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(timestamp(), simple()),
    transports: [
        new winston_1.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=errorLogger.js.map