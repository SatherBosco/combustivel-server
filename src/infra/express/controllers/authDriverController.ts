import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

const secret = process.env.DRIVER_SECRET || "";

import Truck from "../../database/models/Truck";
import Driver, { DriverInput } from "../../database/models/Driver";
import { CreateDriverInput, CreateDriverUseCase } from "../../../application/use-case/create-driver.use-case";

export default class AuthDriverController {
    private static generateAccessToken(params = {}) {
        if (secret === "") return "";
        
        return sign(params, secret, {
            expiresIn: 31536000,
        });
    }
    
    public async register(req: Request, res: Response) {
        // if (!req.role) return res.status(400).send({ message: "Erro: Não autorizado." });

        const { cpf, firstName, lastName, password, licensePlate, company, unit, operation } = req.body;

        const driverInput: CreateDriverInput = {
            cpf: cpf,
            firstName: firstName,
            lastName: lastName,
            password: password,
            licensePlate: licensePlate,
            company: company,
            unit: unit,
            operation: operation
        }
        const response = await CreateDriverUseCase.execute(driverInput);

        return res.status(response.statusCode).send({ message: response.message });
    }
    
    public async authenticate(req: Request, res: Response) {
        const { cpf, password } = req.body;

        const response = await Driver.findOne({ cpf }).select("+password");
        
        return res.status(response.statusCode).send({ message: response.message });
    }
    
    public async changePassword(req: Request, res: Response) {
        // if (!req.role && req.userCPF !== cpf) return res.status(401).send({ message: "Não autorizado." });
        
        const { cpf, newPassword } = req.body;
        
        var response = await Driver.findOne({ cpf }).select("+password");

        return res.status(response.statusCode).send({ message: response.message });
    }

    public async update(req: Request, res: Response) {}

    public async delete(req: Request, res: Response) {}
}
