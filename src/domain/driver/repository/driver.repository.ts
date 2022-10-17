import { Driver } from "../entity/driver.entity";

export interface DriverRepositoryInterface {
    insert(driver?: Driver | string): Promise<void>;
    findAll(): Promise<Driver[]>;
    update(): Promise<void>;
}
