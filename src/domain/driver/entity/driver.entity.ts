import { CreateDriverInput } from "../../../application/use-case/create-driver.use-case";
import { DriverInput } from "../../../infra/database/models/Driver";
import { Either, left, right } from "../../../shared/either";
import { ParametersError } from "../../../shared/parameters.error";
import { ParametersSuccess } from "../../../shared/parameters.success";

export type DriverProps = {
    cpf: string;
    firstName: string;
    lastName: string;
    password: string;
    licensePlate: string;
    company: string;
    unit: string;
    operation: string;
    createdAt: Date;
};

type DriverResponse = Either<ParametersError, CreateDriverInput>;

export class Driver {
    public readonly createdAt: Date;
    public props: Required<DriverProps>;
    private constructor(props: DriverProps) {
        this.props = props;
        this.createdAt = new Date();
    }

    public static create(props: CreateDriverInput): DriverResponse {
        props.cpf = this.normalizeCPF(props.cpf);
        props.firstName = this.normalizeFirstname(props.firstName);
        props.lastName = this.normalizeLastname(props.lastName);
        props.licensePlate = this.normalizeLicensePlate(props.licensePlate);
        props.company = this.normalizeCompany(props.company);
        props.unit = this.normalizeUnit(props.unit);
        props.operation = this.normalizeOperation(props.operation);

        if (!this.isValidCPF(props.cpf)) {
            return left(new ParametersError("CPF inválido.", 400));
        }

        if (!this.isValidFirstname(props.firstName)) {
            return left(new ParametersError("Primeiro nome inválido.", 400));
        }

        if (!this.isValidLastname(props.lastName)) {
            return left(new ParametersError("Sobrenome inválido.", 400));
        }

        if (!this.isValidLicensePlate(props.licensePlate)) {
            return left(new ParametersError("Placa inválida.", 400));
        }
        
        if (!this.isValidCompany(props.company)) {
            return left(new ParametersError("Empresa inválida.", 400));
        }
        
        if (!this.isValidUnit(props.unit)) {
            return left(new ParametersError("Unidade inválida.", 400));
        }

        if (!this.isValidOperation(props.operation)) {
            return left(new ParametersError("Operação inválida.", 400));
        }

        return right(props);
    }

    private static normalizeCPF(cpf: string) {
        cpf = cpf.replace(/\D/g, (letter) => (letter = ""));
        return cpf;
    }

    private static normalizeFirstname(firstname: string) {
        firstname = firstname.toLowerCase();
        firstname = firstname.replace(/\s/g, (letter) => (letter = " "));
        firstname = firstname.replace(/[^a-zA-ZÀ-ü\s]/g, (letter) => (letter = ""));
        firstname = firstname.trim();
        firstname = firstname.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
        return firstname;
    }
    
    private static normalizeLastname(lastname: string) {
        lastname = lastname.toLowerCase();
        lastname = lastname.replace(/\s/g, (letter) => (letter = " "));
        lastname = lastname.replace(/[^a-zA-ZÀ-ü\s]/g, (letter) => (letter = ""));
        lastname = lastname.trim();
        lastname = lastname.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
        return lastname;
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

    private static normalizeOperation(operation: string) {
        operation = operation.toUpperCase();
        operation = operation.replace(/[^A-Z0-9]/g, (letter) => (letter = ""));
        return operation;
    }

    private static isValidCPF(cpf: string) {
        if (cpf.length !== 11) return false;

        return true;
    }

    private static isValidFirstname(firstname: string) {
        if (firstname.length < 3) return false;

        return true;
    }

    private static isValidLastname(lastname: string) {
        if (lastname.length < 3) return false;

        return true;
    }

    private static isValidLicensePlate(licensePlate: string) {
        if (licensePlate.length !== 7) return false;

        return true;
    }

    private static isValidCompany(company: string) {
        if (company.length !== 3) return false;

        return true;
    }

    private static isValidOperation(operation: string) {
        if (operation.length !== 3) return false;

        return true;
    }

    private static isValidUnit(unit: string) {
        if (unit.length !== 3) return false;

        return true;
    }
}