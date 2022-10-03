import { Request, Response } from "express";
import DeleteFiles from "../components/deleteFilesComponent";
import UploadImagesService from "../components/uploadImagesComponents";
import UserInfosComponents from "../components/userInfosComponents";

import Historic from "../models/Historic";
import Truck from "../models/Truck";
import User from "../models/User";

class HistoricController {
    public async getAll(req: Request, res: Response) {
        var initialDate = new Date(req.params.initialDate);
        var finalDate = new Date(req.params.finalDate);

        try {
            var historics = await Historic.find({ date: { $gte: initialDate, $lt: finalDate } });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async getAllByTruck(req: Request, res: Response) {
        const truckLicensePlate = req.params.truckLicensePlate;
        const initialDate = new Date(req.params.initialDate);
        const finalDate = new Date(req.params.finalDate);

        try {
            var historics = await Historic.find({ date: { $gte: initialDate, $lte: finalDate }, truckLicensePlate: truckLicensePlate });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async getAllByUser(req: Request, res: Response) {
        const cpf = req.params.cpf;
        const initialDate = new Date(req.params.initialDate);
        const finalDate = new Date(req.params.finalDate);

        try {
            var historics = await Historic.find({ date: { $gte: initialDate, $lte: finalDate }, cpf: cpf });

            return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
        }
    }

    public async register(req: Request, res: Response) {
        const { truckLicensePlate, date, cpf, month, fuelStationName, currentOdometerValue, liters, value, cnpj, arlaLiters, arlaPrice } = req.body;

        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const deleteFiles = new DeleteFiles();

            if (!files || files === undefined || !files["odometer"] || !files["nota"]) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem arquivo." });
            }

            if (!req.role || req.role !== 4) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem permissão." });
            }

            const user = await User.findOne({ cpf: cpf });
            if (!user) return res.status(400).send({ message: "CPF não encontrado." });

            const truck = await Truck.findOne({ licensePlate: truckLicensePlate });
            if (!truck) return res.status(400).send({ message: "Caminhão não encontrado." });

            const previousOdometerValue = truck.odometer;
            if (previousOdometerValue === currentOdometerValue) return res.status(400).send({ message: "Odometro do abastecimento igual ao atual do caminhão." });

            truck.odometer = currentOdometerValue;
            await truck.save();

            const uploadImagesService = new UploadImagesService();

            const odometerImage = await uploadImagesService.execute(files["odometer"][0]);
            const notaImage = await uploadImagesService.execute(files["nota"][0]);
            deleteFiles.delete();

            if (!odometerImage.sucess || !notaImage.sucess) return res.status(400).send({ message: !odometerImage.sucess ? odometerImage.message : notaImage.message });

            const kmValue = currentOdometerValue - previousOdometerValue;
            const averageValue = kmValue / liters;
            const standardAverage = truck.average;

            var historicObj = {
                fullName: user.fullName,
                cpf: cpf,
                truckLicensePlate: truckLicensePlate,
                date: new Date(date),
                referenceMonth: month,
                fuelStationName: fuelStationName,
                cnpj: cnpj,
                previousOdometer: previousOdometerValue,
                currentOdometer: currentOdometerValue,
                liters: liters,
                value: value,
                km: kmValue,
                average: averageValue,
                standardAverage: standardAverage,
                arlaLiters: arlaLiters || 0,
                arlaPrice: arlaPrice || 0,
                odometerImage: odometerImage.message,
                invoiceImage: notaImage.message,
            };
            const historic = await Historic.create(historicObj);

            const userInfos = await UserInfosComponents.updateUserInfos(cpf, month);

            return res.send({ message: "Abastecimento cadastrado com sucesso.", userInfos, historic });
        } catch {
            return res.status(400).send({ message: "Falha no registro do abstecimento." });
        }
    }

    // public async update(req: Request, res: Response) {
    //     const { historicId, odometer, liters, value } = req.body;

    //     try {
    //         if (!req.role) return res.status(401).send({ message: "Não autorizado." });

    //         var historic = await Historic.findOne({ _id: historicId });

    //         if (!historic) return res.status(400).send({ message: "Lançamento não encontrado." });
    //         if (historic.cpf !== req.userCPF && req.role > 3) return res.status(400).send({ message: "Não autorizado." });

    //         historic.truckLicensePlate = req.body.truckLicensePlate ?? historic.truckLicensePlate;
    //         historic.date = req.body.date ?? historic.date;
    //         historic.user = req.body.user ?? historic.user;
    //         historic.fuelStationName = req.body.fuelStationName ?? historic.fuelStationName;
    //         historic.currentOdometer = req.body.odometer ?? historic.currentOdometer;
    //         historic.previousOdometer = req.body.odometer ?? historic.previousOdometer;
    //         historic.liters = req.body.liters ?? historic.liters;
    //         historic.value = req.body.value ?? historic.value;
    //         historic.km = req.body.km ?? historic.km;
    //         historic.average = req.body.value ?? historic.average;

    //         await historic.save();

    //         return res.send({ message: "Atualização do lançamento concluído com sucesso." });
    //     } catch {
    //         return res.status(400).send({ message: "Falha na atualização do lançamento." });
    //     }
    // }

    public async delete(req: Request, res: Response) {
        const { historicId } = req.body;

        try {
            if (!req.role || !req.userCPF) return res.status(401).send({ message: "Não autorizado." });

            var historic = await Historic.findOne({ _id: historicId });

            if (!historic) return res.status(400).send({ message: "Lançamento não encontrado." });
            if (historic.cpf !== req.userCPF && req.role > 3) return res.status(400).send({ message: "Não autorizado." });

            const historicUp = await Historic.findOne({ truckLicensePlate: historic.truckLicensePlate, previousOdometer: historic.currentOdometer });
            const historicDown = await Historic.findOne({ truckLicensePlate: historic.truckLicensePlate, currentOdometer: historic.previousOdometer });

            var truck = await Truck.findOne({ licensePlate: historic.truckLicensePlate });
            if (!truck) return res.status(400).send({ message: "Erro ao localizar o caminhão." });

            if (!historicUp) {
                if (!historicDown) {
                    truck.odometer = historic.previousOdometer;
                    await truck.save();
                } else {
                    truck.odometer = historicDown.currentOdometer;
                    await truck.save();
                }
            } else {
                if (!historicDown) {
                    historicUp.previousOdometer = historic.previousOdometer;
                } else {
                    historicUp.previousOdometer = historicDown.currentOdometer;
                }

                historicUp.km = historicUp.currentOdometer - historicUp.previousOdometer;
                historicUp.average = historicUp.km / historicUp.liters;
                await historicUp.save();
            }

            await Historic.findOneAndDelete({ _id: historicId });

            const userInfos = await UserInfosComponents.updateUserInfos(req.userCPF, historic.referenceMonth);

            return res.send({ message: "Lançamento excluido do banco de dados.", userInfos });
        } catch {
            return res.status(400).send({ message: "Falha na exclusão do lançamento." });
        }
    }
}

export default new HistoricController();
