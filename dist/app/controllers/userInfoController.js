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
const Historic_1 = __importDefault(require("../models/Historic"));
const Price_1 = __importDefault(require("../models/Price"));
const User_1 = __importDefault(require("../models/User"));
const UserInfos_1 = __importDefault(require("../models/UserInfos"));
class UserInfosController {
    static convertMonthToString(month) {
        switch (month) {
            case 0:
                return "Jan";
            case 1:
                return "Fev";
            case 2:
                return "Mar";
            case 3:
                return "Abr";
            case 4:
                return "Mai";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Ago";
            case 8:
                return "Set";
            case 9:
                return "Out";
            case 10:
                return "Nov";
            case 11:
                return "Dez";
            default:
                return "";
        }
    }
    static getPriceByMonth(month) {
        return __awaiter(this, void 0, void 0, function* () {
            var price = 0;
            try {
                var priceByMonth = yield Price_1.default.findOne({ monthDate: month });
                price = (priceByMonth === null || priceByMonth === void 0 ? void 0 : priceByMonth.price) || 0;
            }
            catch (error) {
                return price;
            }
            return price;
        });
    }
    static getReward(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            var rewards = [];
            try {
                var historicsByDB = yield Historic_1.default.find({ cpf: cpf });
                historicsByDB.sort(function (a, b) {
                    return a.date.getTime() - b.date.getTime();
                });
                for (let index = 0; index < historicsByDB.length; index++) {
                    var monthAndYear = `${UserInfosController.convertMonthToString(historicsByDB[index].date.getMonth())}/${historicsByDB[index].date.getFullYear()}`;
                    var filtered = rewards.filter((itemMonthInFilter) => itemMonthInFilter.referenceDate === monthAndYear);
                    if (filtered.length === 0) {
                        var filteredByMonth = historicsByDB.filter((itemInFilter) => `${UserInfosController.convertMonthToString(itemInFilter.date.getMonth())}/${itemInFilter.date.getFullYear()}` === monthAndYear);
                        var km = 0;
                        var liters = 0;
                        var award = 0;
                        var price = yield UserInfosController.getPriceByMonth(historicsByDB[index].date.getMonth());
                        filteredByMonth.forEach((hist) => {
                            km += hist.km;
                            liters += hist.liters;
                            award += (hist.km / hist.standardAverage - hist.liters) * 0.6 * price;
                        });
                        var average = km / liters;
                        rewards.push({
                            kmTraveled: km,
                            average: average,
                            award: award,
                            referenceDate: monthAndYear,
                        });
                    }
                }
            }
            catch (_a) {
                return rewards;
            }
            return rewards;
        });
    }
    getOneDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cpf = req.params.cpf;
            try {
                const user = yield User_1.default.findOne({ cpf: cpf });
                if (!user)
                    return res.status(400).send({ message: "Usuário não encontrado." });
                const thisMonth = new Date().getMonth() + 1;
                const userInfos = yield UserInfos_1.default.findOne({ cpf: cpf, referenceMonth: thisMonth });
                return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
            }
        });
    }
    getAllOfOneDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cpf = req.params.cpf;
            try {
                const user = yield User_1.default.findOne({ cpf: cpf });
                if (!user)
                    return res.status(400).send({ message: "Usuário não encontrado." });
                const rewards = yield UserInfosController.getReward(cpf);
                return res.send({ message: "Informações do motorista recuperada do banco de dados.", rewards });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
            }
        });
    }
    getOneDriverSpecificMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cpf = req.params.cpf;
            const dateMonth = req.params.dateMonth;
            try {
                const user = yield User_1.default.findOne({ cpf: cpf });
                if (!user)
                    return res.status(400).send({ message: "Usuário não encontrado." });
                const userInfos = yield UserInfos_1.default.findOne({ cpf: cpf, referenceMonth: dateMonth });
                return res.send({ message: "Informações do motorista recuperada do banco de dados.", userInfos });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
            }
        });
    }
    getAllDrivers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateMonth = req.params.dateMonth;
            try {
                var usersInfos = yield UserInfos_1.default.find({ referenceMonth: dateMonth });
                return res.send({ message: "Informações dos motoristas recuperada do banco de dados.", usersInfos });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na solicitação das informações do motorista." });
            }
        });
    }
}
exports.default = new UserInfosController();
