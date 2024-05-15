class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
  }
}

class MissingPropertyError extends ValidationError {
  property: string;
  constructor(property: string) {
    super(`Property: ${property} is missing...`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

class InvalidProperty extends ValidationError {
  property: string;
  constructor(property: string) {
    super(`Property: ${property} is not valid`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

export { MissingPropertyError, InvalidProperty, ValidationError };
