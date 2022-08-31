import { Request, Response } from "express";
import User from "../models/User";

import UserInfos from "../models/UserInfos";

class UserInfosController {
    public async getOneDriver(req: Request, res: Response) {
        const cpf = req.params.cpf;

        try {
            const user = await User.findOne({ cpf: cpf });
            if (!user) return res.status(400).send({ message: "Usuário não encontrado." });
            
            const thisMonth = new Date().getMonth() + 1;

            const userInfos = await UserInfos.findOne({ cpf: cpf, referenceMonth: thisMonth });

            return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }

    public async getOneDriverSpecificMonth(req: Request, res: Response) {
        const cpf = req.params.cpf;
        const dateMonth = req.params.dateMonth;

        try {
            const user = await User.findOne({ cpf: cpf });
            if (!user) return res.status(400).send({ message: "Usuário não encontrado." });

            const userInfos = await UserInfos.findOne({ cpf: cpf, referenceMonth: dateMonth });

            return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }

    public async getAllDrivers(req: Request, res: Response) {
        const dateMonth = req.params.dateMonth;

        try {
            var usersInfos = await UserInfos.find({ referenceMonth: dateMonth });

            return res.send({ message: "Informações dos motoristas recuperada do banco de dados.", usersInfos });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }
}

export default new UserInfosController();
