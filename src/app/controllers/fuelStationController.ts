import { Request, Response } from "express";

import FuelStation from "../models/FuelStation";

class FuelStationController {
    public async getAll(req: Request, res: Response) {
        try {
            var fuelStations = await FuelStation.find({});

            return res.send({ message: "Lista de postos recuperada do banco de dados.", fuelStations });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista de postos." });
        }
    }

    public async register(req: Request, res: Response) {
        const { name } = req.body;
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            if (await FuelStation.findOne({ name: name })) return res.status(400).send({ message: "Posto já cadastrado." });

            var fuelStationObj = { "name": name };
            await FuelStation.create(fuelStationObj);

            return res.send({ message: "Cadastro do posto concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha no registro do posto." });
        }
    }

    public async update(req: Request, res: Response) {
        const { name } = req.body;
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            var fuelStation = await FuelStation.findOne({ _id: req.params.id });
            if (!fuelStation) return res.status(400).send({ message: "Posto não encontrado." });

            fuelStation.name = name ?? fuelStation.name;

            await fuelStation.save();

            return res.send({ message: "Atualização do posto concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha na atualização do posto." });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            await FuelStation.findOneAndDelete({ _id: req.params.id });

            return res.send({ message: "Posto excluido do banco de dados." });
        } catch {
            return res.status(400).send({ message: "Falha na exclusão do posto." });
        }
    }
}

export default new FuelStationController();
