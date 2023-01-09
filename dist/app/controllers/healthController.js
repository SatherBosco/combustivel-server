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
Object.defineProperty(exports, "__esModule", { value: true });
class HealthController {
    health(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send({ message: "OK" });
        });
    }
    appVersion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send({ message: "1.1.0" });
        });
    }
    dashboardVersion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send({ message: "1.0.0" });
        });
    }
    serverVersion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send({ message: "1.0.0" });
        });
    }
}
exports.default = new HealthController();
