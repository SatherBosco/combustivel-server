import { Request, Response } from "express";
import UserInfosComponents from "../components/userInfosComponents";
import User from "../models/User";

import UserInfos from "../models/UserInfos";
import Truck from "../models/Truck";

class UserInfosController {
    public async getOneDriver(req: Request, res: Response) {
        const cpf = req.params.cpf;

        try {
            const thisMonth = new Date().getMonth() + 1;

            const user = await User.findOne({ cpf: cpf });
            if (!user) return res.status(400).send({ message: "CPF não encontrado." });

            const userInfos = await UserInfosComponents.verifyIfUserExist(cpf, user.truckLicensePlate, thisMonth);
            const truck = await Truck.findOne({ licensePlate: user.truckLicensePlate });

            return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos, truck });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }

    public async getOneDriverSpecificMonth(req: Request, res: Response) {
        const cpf = req.params.cpf;
        const dateMonth = req.params.dateMonth;

        try {
            var userInfos = await UserInfos.findOne({ cpf: cpf, referenceMonth: dateMonth });

            if (!userInfos) return res.status(400).send({ message: "Nenhuma informação encontrada com esse CPF nesse mês." });

            return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }

    public async getAllDrivers(req: Request, res: Response) {
        const dateMonth = req.params.dateMonth;

        try {
            var usersInfos = await UserInfos.find({ referenceMonth: dateMonth });

            if (!usersInfos || usersInfos.length === 0) return res.status(400).send({ message: "Nenhuma informação encontrada nesse mês." });

            return res.send({ message: "Informações dos motoristas recuperada do banco de dados.", usersInfos });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
        }
    }
}

export default new UserInfosController();
