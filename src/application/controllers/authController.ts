import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

const secret = process.env.DRIVER_SECRET;

import Truck from "../../infra/database/models/Truck";
import User from "../../infra/database/models/User";

function generateToken(params = {}): string {
    return sign(params, `${secret}`, {
        // expiresIn: 86400,
        expiresIn: 31536000,
    });
}

export class AuthController {
    public async register(req: Request, res: Response) {
        const { cpf, firstName, lastName, password, role, truckLicensePlate } = req.body;

        try {
            if (!req.role || req.role >= role || req.role > 3) return res.status(401).send({ message: "Não autorizado." });

            if (await User.findOne({ cpf })) return res.status(400).send({ message: "CPF já registrado." });
            if (truckLicensePlate && truckLicensePlate !== "") {
                const placa = await Truck.findOne({ licensePlate: truckLicensePlate });
                if (!placa) return res.status(400).send({ message: "Placa não existe." });
            }
            if (!firstName || firstName === "" || !lastName || lastName === "" || !password || password === "") return res.status(400).send({ message: "Dados inválidos." });

            if (role === 4 && (!truckLicensePlate || truckLicensePlate === "")) return res.status(400).send({ message: "Sem placa para o motorista." });

            var userObj = req.body;
            await User.create(userObj);

            return res.send({ message: "Cadastro concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na criação do cadastro." });
        }
    }

    public async authenticate(req: Request, res: Response) {
        const { cpf, password } = req.body;

        try {
            var user = await User.findOne({ cpf }).select("+password");

            if (!user || (await user?.comparePassword(password)) === false) {
                return res.status(400).send({ message: "Username e/ou senha inválido." });
            }

            user?.set("password", undefined);

            const token = generateToken({ cpf: user?.cpf, role: user?.role });

            return res.send({ message: "OK", user, token: token });
        } catch {
            return res.status(400).send({ message: "Falha no login." });
        }
    }

    public async changePassword(req: Request, res: Response) {
        const { newPassword, cpf } = req.body;

        try {
            if (!req.role || !req.cpf) return res.status(401).send({ message: "Não autorizado." });

            var user = await User.findOne({ cpf }).select("+password");

            if (!user) return res.status(400).send({ message: "CPF não encontrado." });

            if (req.role > user.role || (req.role == user.role && req.cpf !== user.cpf)) return res.status(400).send({ message: "Não autorizado." });

            user.password = newPassword;
            await user.save();
            return res.send({ message: "Senha alterada com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na alteração da senha." });
        }
    }
}
