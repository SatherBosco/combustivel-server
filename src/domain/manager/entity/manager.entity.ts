import { Result } from "../../../shared/result";
import { ResultError } from "../../../shared/result-error";

enum Role {
    Master, Director, Manager
}

export type ManagerProps = {
    cpf: string;
    firstname: string;
    lastname: string;
    password: string;
    role: Role;
    company: string;
    unit: string;
};

export class Manager {
    public readonly createdAt: Date;
    public props: Required<ManagerProps>;
    private constructor(props: ManagerProps) {
        this.createdAt = new Date();
        this.props = props;
    }

    public static create(props: ManagerProps): Result<Manager | ResultError> {
        props.cpf = this.normalizeCPF(props.cpf);
        props.firstname = this.normalizeFirstname(props.firstname);
        props.lastname = this.normalizeLastname(props.lastname);
        props.company = this.normalizeCompany(props.company);
        props.unit = this.normalizeUnit(props.unit);

        if (!this.isValidCPF(props.cpf)) {
            return Result.fail<ResultError>(new ResultError("CPF inválido.", 400));
        }

        if (!this.isValidFirstname(props.firstname)) {
            return Result.fail<ResultError>(new ResultError("Primeiro nome inválido.", 400));
        }

        if (!this.isValidLastname(props.lastname)) {
            return Result.fail<ResultError>(new ResultError("Sobrenome inválido.", 400));
        }

        if (!this.isValidCompany(props.company)) {
            return Result.fail<ResultError>(new ResultError("Empresa inválida.", 400));
        }

        if (!this.isValidUnit(props.unit)) {
            return Result.fail<ResultError>(new ResultError("Unidade inválida.", 400));
        }

        return Result.ok<Manager>(new Manager(props));
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

    private static isValidCompany(company: string) {
        if (company.length !== 3) return false;

        return true;
    }

    private static isValidUnit(unit: string) {
        if (unit.length !== 3) return false;

        return true;
    }

    get fullname() {
        return `${this.props.firstname} ${this.props.lastname}`;
    }

    toJSON() {
        return {
            ...this.props,
            createdAt: this.createdAt,
        };
    }
}
