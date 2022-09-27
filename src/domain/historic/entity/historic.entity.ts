import { Result } from "../../../shared/result";
import { ResultError } from "../../../shared/result-error";

export type HistoricProps = {
    cpf: string;
    fullName: string;
    licensePlate: string;
    date: Date;
    fuelStationName: string;
    fuelStationCNPJ: string;
    previousOdometer: number;
    currentOdometer: number;
    literOfFuel: number;
    fuelValue: number;
    kilometerTraveled: number;
    averageReached: number;
    standardAverage: number;
    literOfArla: number;
    arlaValue: number;
    award: number;
    odometerImage: string;
    invoiceImage: string;
};

export class Historic {
    public readonly createdAt: Date;
    public props: Required<HistoricProps>;
    private constructor(props: HistoricProps) {
        this.createdAt = new Date();
        this.props = props;
    }

    public static create(props: HistoricProps): Result<Historic | ResultError> {
        return Result.ok<Historic>(new Historic(props));
    }

    toJSON() {
        return {
            ...this.props,
            createdAt: this.createdAt,
        };
    }
}
