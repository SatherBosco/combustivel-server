import { Request, Response } from "express";

import Truck from "../models/Truck";

class TruckController {
    public async getAll(req: Request, res: Response) {
        try {
            var trucks = await Truck.find({});

            return res.send({ message: "Lista de caminhões recuperada do banco de dados.", trucks });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de caminhões." });
        }
    }

    public async getOne(req: Request, res: Response) {
        try {
            var truck = await Truck.findOne({ licensePlate: req.params.truckLicensePlate });
            if (!truck) return res.status(400).send({ message: "Placa não encontrada." });

            return res.send({ message: "Caminhão recuperado do banco de dados.", truck });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação do caminhão ao banco de dados." });
        }
    }

    public async register(req: Request, res: Response) {   
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            if (await Truck.findOne({ licensePlate: req.params.truckLicensePlate })) return res.status(400).send({ message: "Placa já cadastrada." });

            var truckObj = req.body;
            await Truck.create(truckObj);

            return res.send({ message: "Cadastro do caminhão concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha no registro do caminhão." });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            var truck = await Truck.findOne({ licensePlate: req.params.truckLicensePlate });
            if (!truck) return res.status(400).send({ message: "Placa não encontrada." });

            truck.licensePlate = req.body.licensePlate ?? truck.licensePlate;
            truck.odometer = req.body.odometer ?? truck.odometer;
            truck.capacity = req.body.capacity ?? truck.capacity;
            truck.average = req.body.average ?? truck.average;

            await truck.save();

            return res.send({ message: "Atualização do caminhão concluída com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na atualização do caminhão." });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            await Truck.findOneAndDelete({ licensePlate: req.params.truckLicensePlate });

            return res.send({ message: "Caminhão excluido do banco de dados." });
        } catch {
            return res.status(400).send({ message: "Falha na exclusão do caminhão." });
        }
    }
}

export default new TruckController();
