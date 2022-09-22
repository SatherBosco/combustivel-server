import { Driver } from "../domain/entity/driver-entity";
import { DriverRepositoryInterface } from "../domain/repository/driver-repository";

export class CreateDriverUseCase {
    constructor(private driverRepo: DriverRepositoryInterface) {}

    async execute(input: CreateDriverInput): Promise<CreateDriverOutput> {
        const driver = Driver.create(input);
        await this.driverRepo.insert(driver.isSuccess ? driver.value() : driver.error);
        return driver.value().toJSON();
    }
}

type CreateDriverInput = {
    cpf: string;
    firstname: string;
    lastname: string;
    password: string;
    licensePlate: string;
    company: string;
    unit: string;
};

type CreateDriverOutput = {
    cpf: string;
    firstname: string;
    lastname: string;
    licensePlate: string;
    company: string;
    unit: string;
    createdAt: Date;
};
