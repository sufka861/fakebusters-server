class BadRequest extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
  }
}

class BodyNotSent extends BadRequest {
  constructor() {
    super("Body not sent");
    this.name = this.constructor.name;
  }
}

export { BadRequest, BodyNotSent };
