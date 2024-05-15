class NotFound extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
  }
}

class EntityNotFound extends NotFound {
  entity: string;
  constructor(entity: string) {
    super(`${entity} not found...`);
    this.name = this.constructor.name;
    this.entity = entity;
  }
}

class PropertyNotFound extends NotFound {
  property: string;
  constructor(property: string) {
    super(`Property: ${property} not found...`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

export { EntityNotFound, PropertyNotFound };
