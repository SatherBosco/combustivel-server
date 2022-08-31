import { Request, Response } from "express";
import DeleteFiles from "../components/deleteFilesComponent";
import UploadImagesService from "../components/uploadImagesComponents";
import userInfosComponents from "../components/userInfosComponents";
import UserInfosComponents from "../components/userInfosComponents";

import Historic from "../models/Historic";
import Truck from "../models/Truck";

class HistoricController {
    public async getAll(req: Request, res: Response) {
        const referenceMonth = req.params.referenceMonth;

        try {
            var historics = await Historic.find({ referenceMonth: referenceMonth });

            if (historics.length === 0) return res.status(400).send({ message: "Abastecimentos para esse mês não encontrados." });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async getAllByTruck(req: Request, res: Response) {
        const referenceMonth = req.params.referenceMonth;
        const truckLicensePlate = req.params.truckLicensePlate;

        try {
            var historics = await Historic.find({ referenceMonth: referenceMonth, truckLicensePlate: truckLicensePlate });

            if (historics.length === 0) return res.status(400).send({ message: "Abastecimentos para esse mês e placa não encontrados." });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async getAllByUser(req: Request, res: Response) {
        const referenceMonth = req.params.referenceMonth;
        const cpf = req.params.cpf;

        try {
            var historics = await Historic.find({ referenceMonth: referenceMonth, user: cpf });

            if (historics.length === 0) return res.status(400).send({ message: "Abastecimentos para esse mês e CPF não encontrados." });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async register(req: Request, res: Response) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const deleteFiles = new DeleteFiles();

            if (!files || files === undefined || !files["odometer"] || !files["nota"]) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem arquivo." });
            }

            const uploadImagesService = new UploadImagesService();

            const odometerImage = await uploadImagesService.execute(files["odometer"][0]);
            const notaImage = await uploadImagesService.execute(files["nota"][0]);
            deleteFiles.delete();

            if (!odometerImage.sucess || !notaImage.sucess) return res.status(400).send({ message: !odometerImage.sucess ? odometerImage.message : notaImage.message });

            const { truckLicensePlate, date, cpf, month, fuelStationName, currentOdometerValue, liters, value } = req.body;

            const lastHistoric = await Historic.find({ currentOdometer: { $gt: currentOdometerValue } })
                .sort({ previousOdometer: -1 })
                .limit(1);
            var previousOdometerValue = 0;
            if (lastHistoric && lastHistoric.length > 0) {
                previousOdometerValue = lastHistoric[0].currentOdometer;
            } else {
                const truck = await Truck.findOne({ licensePlate: truckLicensePlate });
                if (truck) {
                    previousOdometerValue = truck.odometer;
                } else {
                    return res.status(400).send({ message: "Erro ao encontrar o caminhão especificado." });
                }
            }

            const kmValue = currentOdometerValue - previousOdometerValue;
            const averageValue = kmValue / liters;

            var historicObj = {
                truckLicensePlate: truckLicensePlate,
                date: date,
                referenceMonth: month,
                user: cpf,
                fuelStationName: fuelStationName,
                previousOdometer: previousOdometerValue,
                currentOdometer: currentOdometerValue,
                liters: liters,
                value: value,
                km: kmValue,
                average: averageValue,
                odometerImage: odometerImage.message,
                invoiceImage: notaImage.message,
            };
            const historic = await Historic.create(historicObj);

            const userInfos = await UserInfosComponents.verifyIfUserExist(cpf, truckLicensePlate, month);

            return res.send({ message: "Abastecimento cadastrado com sucesso.", userInfos, historic });
        } catch {
            return res.status(400).send({ message: "Falha no registro do abstecimento." });
        }
    }

    public async update(req: Request, res: Response) {
        const { historicId, cpf } = req.body;

        try {
            if (!req.role) return res.status(401).send({ message: "Não autorizado." });

            var historic = await Historic.findOne({ _id: historicId });

            if (!historic) return res.status(400).send({ message: "Lançamento não encontrado." });
            if (historic.user !== cpf && req.role > 3) return res.status(400).send({ message: "Não autorizado." });

            historic.truckLicensePlate = req.body.truckLicensePlate ?? historic.truckLicensePlate;
            historic.date = req.body.date ?? historic.date;
            historic.user = req.body.user ?? historic.user;
            historic.fuelStationName = req.body.fuelStationName ?? historic.fuelStationName;
            historic.currentOdometer = req.body.odometer ?? historic.currentOdometer;
            historic.previousOdometer = req.body.odometer ?? historic.previousOdometer;
            historic.liters = req.body.liters ?? historic.liters;
            historic.value = req.body.value ?? historic.value;
            historic.km = req.body.km ?? historic.km;
            historic.average = req.body.value ?? historic.average;

            await historic.save();

            return res.send({ message: "Atualização do lançamento concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na atualização do lançamento." });
        }
    }

    public async delete(req: Request, res: Response) {
        const { historicId, cpf } = req.body;

        try {
            if (!req.role) return res.status(401).send({ message: "Não autorizado." });

            var historic = await Historic.findOne({ _id: historicId });

            if (!historic) return res.status(400).send({ message: "Lançamento não encontrado." });
            if (historic.user !== cpf && req.role > 3) return res.status(400).send({ message: "Não autorizado." });

            await Historic.findOneAndDelete({ _id: historicId });

            return res.send({ message: "Lançamento excluido do banco de dados." });
        } catch {
            return res.status(400).send({ message: "Falha na exclusão do lançamento." });
        }
    }
}

export default new HistoricController();
