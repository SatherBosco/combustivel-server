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
const deleteFilesComponent_1 = __importDefault(require("../components/deleteFilesComponent"));
const uploadImagesComponents_1 = __importDefault(require("../components/uploadImagesComponents"));
const userInfosComponents_1 = __importDefault(require("../components/userInfosComponents"));
const Historic_1 = __importDefault(require("../models/Historic"));
const Truck_1 = __importDefault(require("../models/Truck"));
class HistoricController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceMonth = req.params.referenceMonth;
            try {
                var historics = yield Historic_1.default.find({ referenceMonth: referenceMonth });
                if (historics.length === 0)
                    return res.status(400).send({ message: "Abastecimentos para esse mês não encontrados." });
                return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
            }
        });
    }
    getAllByTruck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceMonth = req.params.referenceMonth;
            const truckLicensePlate = req.params.truckLicensePlate;
            try {
                var historics = yield Historic_1.default.find({ referenceMonth: referenceMonth, truckLicensePlate: truckLicensePlate });
                if (historics.length === 0)
                    return res.status(400).send({ message: "Abastecimentos para esse mês e placa não encontrados." });
                return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
            }
        });
    }
    getAllByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceMonth = req.params.referenceMonth;
            const cpf = req.params.cpf;
            try {
                var historics = yield Historic_1.default.find({ referenceMonth: referenceMonth, user: cpf });
                if (historics.length === 0)
                    return res.status(400).send({ message: "Abastecimentos para esse mês e CPF não encontrados." });
                return res.send({ message: "Lista de abastecimentos recuperada do banco de dados.", historics });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista de abastecimentos." });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const deleteFiles = new deleteFilesComponent_1.default();
                if (!files || files === undefined || !files["odometer"] || !files["nota"]) {
                    deleteFiles.delete();
                    return res.status(400).send({ message: "Sem arquivo." });
                }
                const uploadImagesService = new uploadImagesComponents_1.default();
                const odometerImage = yield uploadImagesService.execute(files["odometer"][0]);
                const notaImage = yield uploadImagesService.execute(files["nota"][0]);
                deleteFiles.delete();
                if (!odometerImage.sucess || !notaImage.sucess)
                    return res.status(400).send({ message: !odometerImage.sucess ? odometerImage.message : notaImage.message });
                const { truckLicensePlate, date, cpf, month, fuelStationName, currentOdometerValue, liters, value } = req.body;
                const lastHistoric = yield Historic_1.default.find({ currentOdometer: { $gt: currentOdometerValue } })
                    .sort({ previousOdometer: -1 })
                    .limit(1);
                var previousOdometerValue = 0;
                const truck = yield Truck_1.default.findOne({ licensePlate: truckLicensePlate });
                if (lastHistoric && lastHistoric.length > 0) {
                    previousOdometerValue = lastHistoric[0].currentOdometer;
                }
                else {
                    if (truck) {
                        previousOdometerValue = truck.odometer;
                    }
                    else {
                        return res.status(400).send({ message: "Erro ao encontrar o caminhão especificado." });
                    }
                }
                if (truck) {
                    if (truck.odometer < currentOdometerValue) {
                        truck.odometer = currentOdometerValue;
                        yield truck.save();
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
                const historic = yield Historic_1.default.create(historicObj);
                const userInfos = yield userInfosComponents_1.default.verifyIfUserExist(cpf, truckLicensePlate, month);
                return res.send({ message: "Abastecimento cadastrado com sucesso.", userInfos, historic });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha no registro do abstecimento." });
            }
        });
    }
    update(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const { historicId, cpf } = req.body;
            try {
                if (!req.role)
                    return res.status(401).send({ message: "Não autorizado." });
                var historic = yield Historic_1.default.findOne({ _id: historicId });
                if (!historic)
                    return res.status(400).send({ message: "Lançamento não encontrado." });
                if (historic.user !== cpf && req.role > 3)
                    return res.status(400).send({ message: "Não autorizado." });
                historic.truckLicensePlate = (_a = req.body.truckLicensePlate) !== null && _a !== void 0 ? _a : historic.truckLicensePlate;
                historic.date = (_b = req.body.date) !== null && _b !== void 0 ? _b : historic.date;
                historic.user = (_c = req.body.user) !== null && _c !== void 0 ? _c : historic.user;
                historic.fuelStationName = (_d = req.body.fuelStationName) !== null && _d !== void 0 ? _d : historic.fuelStationName;
                historic.currentOdometer = (_e = req.body.odometer) !== null && _e !== void 0 ? _e : historic.currentOdometer;
                historic.previousOdometer = (_f = req.body.odometer) !== null && _f !== void 0 ? _f : historic.previousOdometer;
                historic.liters = (_g = req.body.liters) !== null && _g !== void 0 ? _g : historic.liters;
                historic.value = (_h = req.body.value) !== null && _h !== void 0 ? _h : historic.value;
                historic.km = (_j = req.body.km) !== null && _j !== void 0 ? _j : historic.km;
                historic.average = (_k = req.body.value) !== null && _k !== void 0 ? _k : historic.average;
                yield historic.save();
                return res.send({ message: "Atualização do lançamento concluído com sucesso." });
            }
            catch (_l) {
                return res.status(400).send({ message: "Falha na atualização do lançamento." });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { historicId, cpf } = req.body;
            try {
                if (!req.role)
                    return res.status(401).send({ message: "Não autorizado." });
                var historic = yield Historic_1.default.findOne({ _id: historicId });
                if (!historic)
                    return res.status(400).send({ message: "Lançamento não encontrado." });
                if (historic.user !== cpf && req.role > 3)
                    return res.status(400).send({ message: "Não autorizado." });
                yield Historic_1.default.findOneAndDelete({ _id: historicId });
                return res.send({ message: "Lançamento excluido do banco de dados." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na exclusão do lançamento." });
            }
        });
    }
}
exports.default = new HistoricController();
