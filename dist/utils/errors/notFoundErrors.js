"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyNotFound = exports.EntityNotFound = void 0;
class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
    }
}
class EntityNotFound extends NotFound {
    constructor(entity) {
        super(`${entity} not found...`);
        this.name = this.constructor.name;
        this.entity = entity;
    }
}
exports.EntityNotFound = EntityNotFound;
class PropertyNotFound extends NotFound {
    constructor(property) {
        super(`Property: ${property} not found...`);
        this.name = this.constructor.name;
        this.property = property;
    }
}
exports.PropertyNotFound = PropertyNotFound;
//# sourceMappingURL=notFoundErrors.js.map