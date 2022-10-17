export class ParametersError {
    private _message: string;
    private _statusCode: number;

    constructor(message: string, statusCode = 500) {
        this._message = message;
        this._statusCode = statusCode;
    }

    get message() {
        return this._message;
    }

    get statusCode() {
        return this._statusCode;
    }
}
