import { Result } from "../../../shared/result";
import { ResultError } from "../../../shared/result-error";

export type VehicleProps = {
    licensePlate: string;
    odometer: number;
    tankCapacity: number;
    standardAverage: number;
    company: string;
    unit: string;
};

export class Vehicle {
    public readonly createdAt: Date;
    public props: Required<VehicleProps>;
    private constructor(props: VehicleProps) {
        this.createdAt = new Date();
        this.props = props;
    }

    public static create(props: VehicleProps): Result<Vehicle | ResultError> {
        props.licensePlate = this.normalizeLicensePlate(props.licensePlate);
        props.company = this.normalizeCompany(props.company);
        props.unit = this.normalizeUnit(props.unit);
        
        if (!this.isValidLicensePlate(props.licensePlate)) {
            return Result.fail<ResultError>(new ResultError("Placa inválida.", 400));
        }

        if (!this.isValidOdometer(props.odometer)) {
            return Result.fail<ResultError>(new ResultError("Odometro inválido.", 400));
        }

        if (!this.isValidTankCapacity(props.tankCapacity)) {
            return Result.fail<ResultError>(new ResultError("Capacidade do tanque inválida.", 400));
        }

        if (!this.isValidStandardAverage(props.standardAverage)) {
            return Result.fail<ResultError>(new ResultError("Média padrão inválida.", 400));
        }


        if (!this.isValidCompany(props.company)) {
            return Result.fail<ResultError>(new ResultError("Empresa inválida.", 400));
        }

        if (!this.isValidUnit(props.unit)) {
            return Result.fail<ResultError>(new ResultError("Unidade inválida.", 400));
        }

        return Result.ok<Vehicle>(new Vehicle(props));
    }

    private static normalizeLicensePlate(licensePlate: string) {
        licensePlate = licensePlate.toUpperCase();
        licensePlate = licensePlate.replace(/[^A-Z0-9]/g, (letter) => (letter = ""));
        return licensePlate;
    }

    private static normalizeCompany(company: string) {
        company = company.toUpperCase();
        company = company.replace(/[^A-Z0-9]/g, (letter) => (letter = ""));
        return company;
    }

    private static normalizeUnit(unit: string) {
        unit = unit.toUpperCase();
        unit = unit.replace(/[^A-Z0-9]/g, (letter) => (letter = ""));
        return unit;
    }

    private static isValidLicensePlate(licensePlate: string) {
        if (licensePlate.length !== 7) return false;

        return true;
    }

    private static isValidOdometer(odometer: number) {
        if (odometer < 0) return false;

        return true;
    }

    private static isValidTankCapacity(tankCapacity: number) {
        if (tankCapacity <= 0) return false;

        return true;
    }

    private static isValidStandardAverage(standardAverage: number) {
        if (standardAverage <= 0) return false;

        return true;
    }


    private static isValidCompany(company: string) {
        if (company.length !== 3) return false;

        return true;
    }

    private static isValidUnit(unit: string) {
        if (unit.length !== 3) return false;

        return true;
    }

    toJSON() {
        return {
            ...this.props,
            createdAt: this.createdAt,
        };
    }
}
