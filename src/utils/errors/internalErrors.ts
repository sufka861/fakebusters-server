class InternalErrors extends Error {
    status: number;
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        this.status = 500;
    }
}

class ServerUnableError extends InternalErrors {
    action: string;
    constructor(action: string) {
        super(`Unable to ${action} due to internal server error`);
        this.name = this.constructor.name;
        this.action = action;
    }
}

export { ServerUnableError };