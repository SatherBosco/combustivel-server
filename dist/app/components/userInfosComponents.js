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
const Truck_1 = __importDefault(require("../models/Truck"));
const UserInfos_1 = __importDefault(require("../models/UserInfos"));
class UserInfosComponents {
    verifyIfUserExist(cpf, truckLicensePlate, referenceMonth) {
        return __awaiter(this, void 0, void 0, function* () {
            var userInfos = yield UserInfos_1.default.findOne({ cpf: cpf, referenceMonth: referenceMonth });
            if (!userInfos)
                userInfos = yield this.createUserInfos(cpf, truckLicensePlate);
            const obj = yield this.updateUserInfos(cpf, referenceMonth, truckLicensePlate);
            userInfos.kmTraveled = obj.kmTraveled;
            userInfos.average = obj.average;
            userInfos.lastAverage = obj.lastAverage;
            userInfos.award = obj.award;
            yield userInfos.save();
            return userInfos;
        });
    }
    createUserInfos(cpf, truckLicensePlate) {
        return __awaiter(this, void 0, void 0, function* () {
            var thisMonth = new Date().getMonth() + 1;
            var accountObj = {
                cpf: cpf,
                truckLicensePlate: truckLicensePlate,
                referenceMonth: thisMonth,
            };
            var userInfos = yield UserInfos_1.default.create(accountObj);
            return userInfos;
        });
    }
    updateUserInfos(cpf, referenceMonth, truckLicensePlate) {
        return __awaiter(this, void 0, void 0, function* () {
            var historics = yield Historic_1.default.find({ user: cpf, referenceMonth: referenceMonth }).sort({ createdAt: 1 });
            var truck = yield Truck_1.default.findOne({ licensePlate: truckLicensePlate });
            var infoObj = {
                kmTraveled: 0,
                average: 0,
                lastAverage: 0,
                award: 0,
            };
            if (!historics || historics.length === 0 || !truck)
                return infoObj;
            var km = 0;
            var litros = 0;
            var preco = 0;
            for (let index = 0; index < historics.length; index++) {
                var km = km + historics[index].km;
                var litros = litros + historics[index].liters;
                var preco = preco + historics[index].value;
            }
            var media = km / litros;
            var premio = (km / truck.average - litros) * 0.6 * (preco / litros);
            var lastMedia = (historics[historics.length - 1].km) / historics[historics.length - 1].liters;
            infoObj.kmTraveled = km;
            infoObj.average = media;
            infoObj.lastAverage = lastMedia;
            infoObj.award = premio;
            return infoObj;
        });
    }
}
exports.default = new UserInfosComponents();
