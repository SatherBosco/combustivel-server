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

    public async updateMedia() {
        try {
            const motoristas = [
                "Diego Francisco Dos Santos De Oliveira",
                "Michael Candido Da Silva",
                "Robson Juan Gomes",
                "Everton Andre Cosntantino",
                "Maykon Cesar Pereira Barros",
                "Vinicius Cesar Da Silva",
                "Rubens Alexandre Dias",
                "Antonio Carlos Tomaz Da Silva",
                "Luciano Pereira De Almeida",
                "Robson Alexandre Dos Santos",
                "Ricardo Silvestre",
                "Adriano Jose De Souza",
                "Marcos Paulo Pereira De Araujo",
                "WeslEy Figueira Roberto",
                "Geisel Nogueira De Matos",
                "Samuel Gignon Bonilha Canalli",
                "Alessandro Ferreira Moreira",
                "Eduardo Henrique Baptista De Oliveira",
                "Janser Luis Rezende",
                "Raniere Gomes Monteiro",
                "Jose Milton De Santana Filho",
                "Marcelo Vieira Dos Reis Treva",
                "Jose Aparecido De Castro",
                "Antonio Almeida"
            ];

            const placas = [
                "FGW-5H46",
                "GJF-8G13",
                "BZK-0C33",
                "GBB-9F36",
                "FYI-6J06",
                "FZS-9J94",
                "GJK-2132",
                "GFI-4F44",
                "GGU-8J41",
                "GHE-0H27",
                "FWW-2J63",
                "GGH-7G35",
                "FYW-2J63",
                "CBI-8F17",
                "GCZ-6I94",
                "DCU-9D42",
                "DKI-4E71",
                "CFZ-3C21",
                "BYQ-5H32",
                "FFL-5F83",
                "GCZ-1F04",
                "DKH-4A66",
                "DWO-0G13",
                "FPB-4A57"
            ];

            const tres = [
                "FGW-5H46",
                "GJF-8G13",
                "BZK-0C33",
                "GBB-9F36",
                "FYI-6J06",
                "FZS-9J94",
                "GJK-2132",
                "GFI-4F44",
                "GGU-8J41",
                "GHE-0H27",
                "FWW-2J63",
                "GGH-7G35",
                "FYW-2J63",
                "CBI-8F17",
                "GCZ-6I94",
                "DCU-9D42",
                "DKI-4E71",
                "CFZ-3C21",
                "BYQ-5H32",
                "FFL-5F83"
            ];

            for (let index = 0; index < tres.length; index++) {
                var truck = await Truck.findOne({ licensePlate: tres[index] });
                if (truck) {
                    console.log(tres[index] + " Start");
                    truck.average = 4.5;
                    await truck.save();
                } else {
                    console.log(tres[index] + " Erro");
                }
            }

        } catch {
            console.log("Erro");
        }
    }
}

export default new TruckController();
