export class ParametersSuccess<T> {
    private _message: string;
    private _statusCode: number;
    private _data: T;

    constructor(message: string, statusCode = 200, data: T) {
        this._message = message;
        this._statusCode = statusCode;
        this._data = data;
    }

    get message() {
        return this._message;
    }

    get statusCode() {
        return this._statusCode;
    }

    get data() {
        return this._data;
    }
}
