import { Driver, DriverProps } from "./driver.entity";

describe("Driver Tests", () => {
    test("Create Driver Sucess", () => {
        let driverProps: DriverProps = {
            cpf: "000.000.00-000",
            firstname: "Joao vitor",
            lastname: " Sather Bosco ",
            password: "123456789",
            licensePlate: "AAA0000",
            company: "R3T",
            unit: "MTZ",
        };
        let driver = Driver.create(driverProps);
        expect(driver.isSuccess).toBe(true);
        expect(driver.isFailure).toBe(false);
        expect(driver.error).toBeUndefined();
        expect(driver.value().fullname).toBe("Joao Vitor Sather Bosco");
        expect(driver.value().props.cpf).toBe("00000000000");
    });

    test("Create Driver Name Error", () => {
        let driverProps: DriverProps | Error = {
            cpf: "00000000000",
            firstname: "Jo",
            lastname: "",
            password: "123456789",
            licensePlate: "AAA0000",
            company: "R3T",
            unit: "MTZ",
        };
        let driver = Driver.create(driverProps);
        expect(driver.isFailure).toBe(true);
        expect(driver.isSuccess).toBe(false);
        expect(driver.error?.length).toBeGreaterThan(3);
    });

    test("Create Driver CPF Error", () => {
        let driverProps: DriverProps | Error = {
            cpf: "0000000000",
            firstname: "Joao",
            lastname: "Bosco",
            password: "123456789",
            licensePlate: "AAA0000",
            company: "R3T",
            unit: "MTZ",
        };
        let driver = Driver.create(driverProps);
        expect(driver.isFailure).toBe(true);
        expect(driver.isSuccess).toBe(false);
        expect(driver.error?.length).toBeGreaterThan(0);
    });
});
