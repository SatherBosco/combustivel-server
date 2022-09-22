export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    private _value?: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: O resultado não pode ser sucesso e contar uma mensagem de erro.`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: O resultado não pode ser falha e não conter uma mensagem de erro.`);
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    public value(): T {
        if (!this.isSuccess) {
            throw new Error(`Não é possível retornar um valor de um resultado falho.`);
        }

        return this._value!;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, `Erro: ${error}`, undefined);
    }
}
