import { Request, Response } from "express";

import FuelStation, { FuelStationInput } from "../../infra/database/models/FuelStation";

class FuelStationController {
    public async getAll(req: Request, res: Response) {
        try {
            var fuelStations = await FuelStation.find({});

            return res.send({ message: "Lista de postos recuperada do banco de dados.", fuelStations });
        } catch {
            return res.status(400).send({ message: "Erro: Falha na solicitação da lista de postos." });
        }
    }

    public async register(req: Request, res: Response) {
        var { name, cnpj } = req.body;

        try {
            if (!req.role) return res.status(401).send({ message: "Erro: Não autorizado." });

            name = name.trim();
            cnpj = cnpj.replace(" ", "");

            if (await FuelStation.findOne({ cnpj: cnpj })) return res.status(400).send({ message: "Erro: CNPJ do posto já cadastrado." });

            var fuelStationObj: FuelStationInput = {
                name: name,
                cnpj: cnpj,
                unit: "R3T",
            };
            await FuelStation.create(fuelStationObj);

            return res.send({ message: "Cadastro do posto concluído com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha no registro do posto." });
        }
    }

    public async update(req: Request, res: Response) {
        const { name, cnpj } = req.body;
        try {
            if (!req.role) return res.status(401).send({ message: "Erro: Não autorizado." });

            var fuelStation = await FuelStation.findOne({ cnpj: cnpj });
            if (!fuelStation) return res.status(400).send({ message: "Erro: Posto não encontrado." });

            fuelStation.name = name ?? fuelStation.name;

            await fuelStation.save();

            return res.send({ message: "Atualização do posto concluída com sucesso." });
        } catch {
            return res.status(400).send({ message: "Erro: Falha na atualização do posto." });
        }
    }

    public async delete(req: Request, res: Response) {
        const { cnpj } = req.body;
        try {
            if (!req.role) {
                return res.status(401).send({ message: "Erro: Não autorizado." });
            }

            await FuelStation.findOneAndDelete({ cnpj: cnpj });

            return res.send({ message: "Posto excluido do banco de dados." });
        } catch {
            return res.status(400).send({ message: "Erro: Falha na exclusão do posto." });
        }
    }
}

export default new FuelStationController();
