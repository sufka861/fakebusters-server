"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyNotSent = exports.BadRequest = void 0;
class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}
exports.BadRequest = BadRequest;
class BodyNotSent extends BadRequest {
    constructor() {
        super('Body not sent');
        this.name = this.constructor.name;
    }
}
exports.BodyNotSent = BodyNotSent;
//# sourceMappingURL=badRequestErrors.js.map