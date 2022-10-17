import { Driver, DriverProps } from "../../domain/driver/entity/driver.entity";
import { DriverRepositoryInterface } from "../../domain/driver/repository/driver.repository";

export type CreateDriverInput = {
    cpf: string;
    firstName: string;
    lastName: string;
    password: string;
    licensePlate: string;
    company: string;
    unit: string;
    operation: string;
};

export type CreateDriverOutput = {
    cpf: string;
    firstname: string;
    lastname: string;
    licensePlate: string;
    company: string;
    unit: string;
    createdAt: Date;
};

export class CreateDriverUseCase {
    constructor(private driverRepo: DriverRepositoryInterface) {}

    async execute(input: CreateDriverInput): Promise<CreateDriverOutput> {
        const driver = new Driver().create(input);
        await this.driverRepo.insert(driver.isSuccess ? driver.value() : driver.error);
        return driver.value().toJSON();
    }

    private toJson(driver: DriverResponse, ) {
        return {
            ...this.props,
            createdAt: this.createdAt,
        };
    }
}
