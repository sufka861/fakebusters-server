"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require('morgan');
morgan((tokens, req, res) => {
    return [
        tokens.date(),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});
module.exports = {
    morgan,
};
//# sourceMappingURL=httpLogger.js.map