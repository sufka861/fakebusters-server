"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.InvalidProperty = exports.MissingPropertyError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}
exports.ValidationError = ValidationError;
class MissingPropertyError extends ValidationError {
    constructor(property) {
        super(`Property: ${property} is missing...`);
        this.name = this.constructor.name;
        this.property = property;
    }
}
exports.MissingPropertyError = MissingPropertyError;
class InvalidProperty extends ValidationError {
    constructor(property) {
        super(`Property: ${property} is not valid`);
        this.name = this.constructor.name;
        this.property = property;
    }
}
exports.InvalidProperty = InvalidProperty;
//# sourceMappingURL=validationErrors.js.map