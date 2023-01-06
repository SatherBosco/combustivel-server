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
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
const User_1 = __importDefault(require("../models/User"));
class MaintenanceController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var maintenance = yield Maintenance_1.default.find({});
                return res.send({ message: "Lista recuperada do banco de dados.", maintenance });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista." });
            }
        });
    }
    getAllByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var maintenance = yield Maintenance_1.default.find({ cpf: req.userCPF });
                return res.send({ message: "Lista recuperada do banco de dados.", maintenance });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação da lista." });
            }
        });
    }
    create(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { truckLicensePlate, cartLicensePlate, odometer, occurrence, occurrenceDescription } = req.body;
                const files = req.files;
                const deleteFiles = new deleteFilesComponent_1.default();
                if (!files || files === undefined || !files["imageOne"]) {
                    deleteFiles.delete();
                    return res.status(400).send({ message: "Sem arquivo." });
                }
                if (!req.role || req.role !== 4) {
                    deleteFiles.delete();
                    return res.status(400).send({ message: "Sem permissão." });
                }
                const user = yield User_1.default.findOne({ cpf: req.userCPF });
                if (!user)
                    return res.status(400).send({ message: "CPF não encontrado." });
                const uploadImagesService = new uploadImagesComponents_1.default();
                const auxDriver = { sucess: true, message: "" };
                const imageOne = yield uploadImagesService.execute(files["imageOne"][0]);
                const imageTwo = !files["imageTwo"] ? auxDriver : yield uploadImagesService.execute(files["imageTwo"][0]);
                const imageThree = !files["imageThree"] ? auxDriver : yield uploadImagesService.execute(files["imageThree"][0]);
                deleteFiles.delete();
                if (!imageOne.sucess || !imageTwo.sucess || !imageThree.sucess)
                    return res.status(400).send({ message: "Erro no upload." });
                var maintenanceObj = {
                    fullName: user.fullName,
                    cpf: (_a = req.userCPF) !== null && _a !== void 0 ? _a : "",
                    truckLicensePlate: truckLicensePlate,
                    cartLicensePlate: cartLicensePlate !== null && cartLicensePlate !== void 0 ? cartLicensePlate : "",
                    odometer: odometer,
                    occurrence: occurrence,
                    occurrenceDescription: occurrenceDescription,
                    occurrenceImageOne: imageOne.message,
                    occurrenceImageTwo: imageTwo.message,
                    occurrenceImageThree: imageThree.message,
                };
                yield Maintenance_1.default.create(maintenanceObj);
                return res.send({ message: "Criado." });
            }
            catch (_b) {
                return res.status(400).send({ message: "Falha na criação." });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, actionStatus, actionDescription, actionImageOne, actionImageTwo, actionImageThree } = req.body;
                const files = req.files;
                const deleteFiles = new deleteFilesComponent_1.default();
                if (!files || files === undefined || !files["imageOne"]) {
                    deleteFiles.delete();
                    return res.status(400).send({ message: "Sem arquivo." });
                }
                if (!req.role || req.role !== 4) {
                    deleteFiles.delete();
                    return res.status(400).send({ message: "Sem permissão." });
                }
                const occurrence = yield Maintenance_1.default.findOne({ _id: id });
                if (!occurrence)
                    return res.status(400).send({ message: "Ocorrencia não encontrada." });
                const uploadImagesService = new uploadImagesComponents_1.default();
                const auxDriver = { sucess: true, message: "" };
                const imageOne = yield uploadImagesService.execute(files["imageOne"][0]);
                const imageTwo = !files["imageTwo"] ? auxDriver : yield uploadImagesService.execute(files["imageTwo"][0]);
                const imageThree = !files["imageThree"] ? auxDriver : yield uploadImagesService.execute(files["imageThree"][0]);
                deleteFiles.delete();
                if (!imageOne.sucess || !imageTwo.sucess || !imageThree.sucess)
                    return res.status(400).send({ message: "Erro no upload." });
                occurrence.actionStatus = actionStatus !== null && actionStatus !== void 0 ? actionStatus : "";
                occurrence.actionDescription = actionDescription !== null && actionDescription !== void 0 ? actionDescription : "";
                occurrence.actionImageOne = actionImageOne !== null && actionImageOne !== void 0 ? actionImageOne : "";
                occurrence.actionImageTwo = actionImageTwo !== null && actionImageTwo !== void 0 ? actionImageTwo : "";
                occurrence.actionImageThree = actionImageThree !== null && actionImageThree !== void 0 ? actionImageThree : "";
                if (actionDescription.lenght > 0)
                    occurrence.closedAt = new Date();
                yield occurrence.save();
                return res.send({ message: "Atualizado." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na atualização." });
            }
        });
    }
}
exports.default = new MaintenanceController();
