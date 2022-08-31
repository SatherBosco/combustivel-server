import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

import authConfig from "../../configs/auth.json";

import User from "../models/User";

function generateToken(params = {}) {
    return sign(params, authConfig.secret, {
        // expiresIn: 86400,
        expiresIn: 31536000,
    });
}

class AuthController {
    public async register(req: Request, res: Response) {
        const { cpf, role } = req.body;

        try {
            if (!req.role || req.role >= role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            if (await User.findOne({ cpf })) return res.status(400).send({ message: "CPF já registrado." });

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

            return res.send({
                message: "OK",
                user,
                token: generateToken({ id: user?._id, role: user?.role }),
            });
        } catch {
            return res.status(400).send({ message: "Falha no login." });
        }
    }

    public async changePassword(req: Request, res: Response) {
        const { newPassword, cpf } = req.body;

        try {
            if (!req.role) return res.status(401).send({ message: "Não autorizado." });

            var user = await User.findOne({ cpf }).select("+password");

            if (!user) return res.status(400).send({ message: "CPF não encontrado." });

            if (req.role <= user.role) {
                user.password = newPassword;
                await user.save();
                return res.send({ message: "Senha alterada com sucesso." });
            } else return res.status(400).send({ message: "Não autorizado." });
        } catch {
            return res.status(400).send({ message: "Falha na alteração da senha." });
        }
    }
}

export default new AuthController();
