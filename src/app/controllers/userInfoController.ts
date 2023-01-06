import { Request, Response } from "express";
import Historic from "../models/Historic";
import Price from "../models/Price";
import User from "../models/User";

import UserInfos from "../models/UserInfos";

export type UserReward = {
    kmTraveled: number;
    average: number;
    award: number;
    referenceDate: string;
};

class UserInfosController {
    private static convertMonthToString(month: number): string {
        switch (month) {
            case 0:
                return "Jan";
            case 1:
                return "Fev";
            case 2:
                return "Mar";
            case 3:
                return "Abr";
            case 4:
                return "Mai";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Ago";
            case 8:
                return "Set";
            case 9:
                return "Out";
            case 10:
                return "Nov";
            case 11:
                return "Dez";
            default:
                return "";
        }
    }

    private static async getPriceByMonth(month: number): Promise<number> {
        var price = 0;

        try {
            var priceByMonth = await Price.findOne({ monthDate: month });
            price = priceByMonth?.price || 0;
        } catch (error) {
            return price;
        }

        return price;
    }

    private static async getReward(cpf: string): Promise<UserReward[]> {
        var rewards: UserReward[] = [];

        try {
            var historicsByDB = await Historic.find({ cpf: cpf });

            historicsByDB.sort(function (a, b) {
                return a.date.getTime() - b.date.getTime();
            });

            for (let index = 0; index < historicsByDB.length; index++) {
                var monthAndYear = `${UserInfosController.convertMonthToString(historicsByDB[index].date.getMonth())}/${historicsByDB[index].date.getFullYear()}`;
                var filtered = rewards.filter((itemMonthInFilter) => itemMonthInFilter.referenceDate === monthAndYear);

                if (filtered.length === 0) {
                    var filteredByMonth = historicsByDB.filter(
                        (itemInFilter) => `${UserInfosController.convertMonthToString(itemInFilter.date.getMonth())}/${itemInFilter.date.getFullYear()}` === monthAndYear
                    );

                    var km = 0;
                    var liters = 0;
                    var award = 0;
                    var price = await UserInfosController.getPriceByMonth(historicsByDB[index].date.getMonth() + 1);

                    filteredByMonth.forEach((hist) => {
                        km += hist.km;
                        liters += hist.liters;
                        award += (hist.km / hist.standardAverage - hist.liters) * 0.6 * price;
                    });

                    var average = km / liters;

                    rewards.push({
                        kmTraveled: km,
                        average: average,
                        award: award,
                        referenceDate: monthAndYear,
                    });
                }
            }
        } catch {
            return rewards;
        }

        return rewards;
    }

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

    public async getAllOfOneDriver(req: Request, res: Response) {
        const cpf = req.params.cpf;

        try {
            const user = await User.findOne({ cpf: cpf });
            if (!user) return res.status(400).send({ message: "Usuário não encontrado." });

            const rewards = await UserInfosController.getReward(cpf);

            return res.send({ message: "Informações do motorista recuperada do banco de dados.", rewards });
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
