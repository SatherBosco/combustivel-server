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
            if (!req.params.licensePlate || req.params.licensePlate === "") return res.status(400).send({ message: "Dados inválidos." });

            var truck = await Truck.findOne({ licensePlate: req.params.licensePlate });
            
            if (!truck) return res.status(400).send({ message: "Placa não encontrada." });

            return res.send({ message: "Caminhão recuperado do banco de dados.", truck });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação do caminhão ao banco de dados." });
        }
    }

    public async register(req: Request, res: Response) {
        const { licensePlate, odometer, capacity, average } = req.body;
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            if (!licensePlate || licensePlate === "" || !odometer || odometer === "" || !capacity || capacity === "" || !average || average === "")
                return res.status(400).send({ message: "Dados inválidos." });

            if (await Truck.findOne({ licensePlate: licensePlate })) return res.status(400).send({ message: "Placa já cadastrada." });

            var truckObj = {
                "licensePlate": licensePlate,
                "odometer": odometer,
                "capacity": capacity,
                "average": average
            };
            await Truck.create(truckObj);

            return res.send({ message: "Cadastro do caminhão concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha no registro do caminhão." });
        }
    }

    public async update(req: Request, res: Response) {
        const { licensePlate, odometer, capacity, average } = req.body;
        try {
            if (!req.role || req.role > 3) 
                return res.status(401).send({ message: "Não autorizado." });

            if (!licensePlate || licensePlate === "")
                return res.status(400).send({ message: "Dados inválidos." });

            var truck = await Truck.findOne({ licensePlate: licensePlate });
            if (!truck) return res.status(400).send({ message: "Placa não encontrada." });

            truck.licensePlate = licensePlate ?? truck.licensePlate;
            truck.odometer = odometer ?? truck.odometer;
            truck.capacity = capacity ?? truck.capacity;
            truck.average = average ?? truck.average;

            await truck.save();

            return res.send({ message: "Atualização do caminhão concluída com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na atualização do caminhão." });
        }
    }

    public async delete(req: Request, res: Response) {
        const { licensePlate } = req.body;
        try {
            if (!req.role || req.role > 3) 
                return res.status(401).send({ message: "Não autorizado." });
            
            if (!licensePlate || licensePlate === "")
                return res.status(400).send({ message: "Dados inválidos." });

            await Truck.findOneAndDelete({ licensePlate: licensePlate });

            return res.send({ message: "Caminhão excluido do banco de dados." });
        } catch {
            return res.status(400).send({ message: "Falha na exclusão do caminhão." });
        }
    }
}

export default new TruckController();
