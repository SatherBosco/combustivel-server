export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    private _value?: T;
    private _error?: T;

    private constructor(isSuccess: boolean, error?: T, value?: T) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this._error = error;

        Object.freeze(this);
    }

    public value(): T {
        if (this.isSuccess) {
            return this._value!;
        } else {
            return this._error!;
        }

    }

    public static ok<U>(value: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: U): Result<U> {
        return new Result<U>(false, error, undefined);
    }
}
