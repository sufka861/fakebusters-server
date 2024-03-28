"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUnableError = void 0;
class InternalErrors extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 500;
    }
}
class ServerUnableError extends InternalErrors {
    constructor(action) {
        super(`Unable to ${action} due to internal server error`);
        this.name = this.constructor.name;
        this.action = action;
    }
}
exports.ServerUnableError = ServerUnableError;
//# sourceMappingURL=internalErrors.js.map