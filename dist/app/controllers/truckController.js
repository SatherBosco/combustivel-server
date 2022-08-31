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
                var truck = yield Truck_1.default.findOne({ licensePlate: req.params.truckLicensePlate });
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
            try {
                if (!req.role || req.role > 3) {
                    return res.status(401).send({ message: "Não autorizado." });
                }
                if (yield Truck_1.default.findOne({ licensePlate: req.params.truckLicensePlate }))
                    return res.status(400).send({ message: "Placa já cadastrada." });
                var truckObj = req.body;
                yield Truck_1.default.create(truckObj);
                return res.send({ message: "Cadastro do caminhão concluído com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha no registro do caminhão." });
            }
        });
    }
    update(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.role || req.role > 3) {
                    return res.status(401).send({ message: "Não autorizado." });
                }
                var truck = yield Truck_1.default.findOne({ licensePlate: req.params.truckLicensePlate });
                if (!truck)
                    return res.status(400).send({ message: "Placa não encontrada." });
                truck.licensePlate = (_a = req.body.licensePlate) !== null && _a !== void 0 ? _a : truck.licensePlate;
                truck.odometer = (_b = req.body.odometer) !== null && _b !== void 0 ? _b : truck.odometer;
                truck.capacity = (_c = req.body.capacity) !== null && _c !== void 0 ? _c : truck.capacity;
                truck.average = (_d = req.body.average) !== null && _d !== void 0 ? _d : truck.average;
                yield truck.save();
                return res.send({ message: "Atualização do caminhão concluída com sucesso." });
            }
            catch (_e) {
                return res.status(400).send({ message: "Falha na atualização do caminhão." });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.role || req.role > 3) {
                    return res.status(401).send({ message: "Não autorizado." });
                }
                yield Truck_1.default.findOneAndDelete({ licensePlate: req.params.truckLicensePlate });
                return res.send({ message: "Caminhão excluido do banco de dados." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na exclusão do caminhão." });
            }
        });
    }
}
exports.default = new TruckController();
