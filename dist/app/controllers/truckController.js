"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Truck_1 = __importDefault(require("../models/Truck"));
class TruckController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var trucks = yield Truck_1.default.find({});
                return res.send({ message: "Lista de caminhões recuperada do banco de dados.", trucks });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista de caminhões." });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.licensePlate || req.params.licensePlate === "")
                    return res.status(400).send({ message: "Dados inválidos." });
                var truck = yield Truck_1.default.findOne({ licensePlate: req.params.licensePlate });
                if (!truck)
                    return res.status(400).send({ message: "Placa não encontrada." });
                return res.send({ message: "Caminhão recuperado do banco de dados.", truck });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação do caminhão ao banco de dados." });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { licensePlate, odometer, capacity, average } = req.body;
            try {
                if (!req.role || req.role > 3) {
                    return res.status(401).send({ message: "Não autorizado." });
                }
                if (!licensePlate || licensePlate === "" || !odometer || odometer === "" || !capacity || capacity === "" || !average || average === "")
                    return res.status(400).send({ message: "Dados inválidos." });
                if (yield Truck_1.default.findOne({ licensePlate: licensePlate }))
                    return res.status(400).send({ message: "Placa já cadastrada." });
                var truckObj = {
                    "licensePlate": licensePlate,
                    "odometer": odometer,
                    "capacity": capacity,
                    "average": average
                };
                yield Truck_1.default.create(truckObj);
                return res.send({ message: "Cadastro do caminhão concluído com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha no registro do caminhão." });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { licensePlate, odometer, capacity, average } = req.body;
            try {
                if (!req.role || req.role > 3)
                    return res.status(401).send({ message: "Não autorizado." });
                if (!licensePlate || licensePlate === "")
                    return res.status(400).send({ message: "Dados inválidos." });
                var truck = yield Truck_1.default.findOne({ licensePlate: licensePlate });
                if (!truck)
                    return res.status(400).send({ message: "Placa não encontrada." });
                truck.licensePlate = licensePlate !== null && licensePlate !== void 0 ? licensePlate : truck.licensePlate;
                truck.odometer = odometer !== null && odometer !== void 0 ? odometer : truck.odometer;
                truck.capacity = capacity !== null && capacity !== void 0 ? capacity : truck.capacity;
                truck.average = average !== null && average !== void 0 ? average : truck.average;
                yield truck.save();
                return res.send({ message: "Atualização do caminhão concluída com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na atualização do caminhão." });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { licensePlate } = req.body;
            try {
                if (!req.role || req.role > 3)
                    return res.status(401).send({ message: "Não autorizado." });
                if (!licensePlate || licensePlate === "")
                    return res.status(400).send({ message: "Dados inválidos." });
                yield Truck_1.default.findOneAndDelete({ licensePlate: licensePlate });
                return res.send({ message: "Caminhão excluido do banco de dados." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na exclusão do caminhão." });
            }
        });
    }
    updateMedia() {
        return __awaiter(this, void 0, void 0, function* () {
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
                    var truck = yield Truck_1.default.findOne({ licensePlate: tres[index] });
                    if (truck) {
                        console.log(tres[index] + " Start");
                        truck.average = 4.5;
                        yield truck.save();
                    }
                    else {
                        console.log(tres[index] + " Erro");
                    }
                }
            }
            catch (_a) {
                console.log("Erro");
            }
        });
    }
}
exports.default = new TruckController();
