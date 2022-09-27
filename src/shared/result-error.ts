export class ResultError {
    public errorMessage: string;
    public errorCode: number;

    constructor(errorMessage: string, errorCode: number) {
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }
}