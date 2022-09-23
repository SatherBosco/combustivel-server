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
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_json_1 = __importDefault(require("../../configs/auth.json"));
const Truck_1 = __importDefault(require("../models/Truck"));
const Driver_1 = __importDefault(require("../models/Driver"));
class AuthDriverController {
    generateAccessToken(params = {}) {
        return (0, jsonwebtoken_1.sign)(params, auth_json_1.default["driver-access"], {
            expiresIn: 31536000,
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { cpf, firstName, lastName, password, licensePlate } = req.body;
            try {
                if (!req.role)
                    return res.status(400).send({ message: "Erro: Não autorizado." });
                cpf = cpf.replace(" ", "");
                firstName = firstName.trim();
                lastName = lastName.trim();
                licensePlate = licensePlate.trim();
                if (!cpf || cpf === "" || cpf.length !== 11)
                    return res.status(400).send({ message: "Erro: CPF inválido. Não pode ser vazio." });
                if (yield Driver_1.default.findOne({ cpf }))
                    return res.status(400).send({ message: "Erro: CPF já registrado." });
                if (!licensePlate && licensePlate === "")
                    return res.status(400).send({ message: "Erro: Sem placa." });
                if (!(yield Truck_1.default.findOne({ licensePlate: licensePlate })))
                    return res.status(400).send({ message: "Erro: Placa não existe." });
                if (!firstName || firstName === "" || firstName.length < 3)
                    return res.status(400).send({ message: "Erro: Primeiro nome inválido. Não pode ser vazio e deve conter ao menos 3 caracteres." });
                if (!lastName || lastName === "" || lastName.length < 3)
                    return res.status(400).send({ message: "Erro: Sobrenome inválido. Não pode ser vazio e deve conter ao menos 3 caracteres." });
                if (!password || password === "" || password.length < 8 || password.includes(" "))
                    return res.status(400).send({
                        message: "Erro: Senha inválida. Não pode ser vazio, não pode conter espaço em branco e deve conter ao menos 8 caracteres.",
                    });
                var driverObj = {
                    cpf: cpf,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    licensePlate: licensePlate,
                    unit: "R3T",
                };
                yield Driver_1.default.create(driverObj);
                return res.send({ message: "Cadastro concluído com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Erro: Falha na criação do cadastro." });
            }
        });
    }
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cpf, password } = req.body;
            try {
                var driver = yield Driver_1.default.findOne({ cpf }).select("+password");
                if (!driver || (yield (driver === null || driver === void 0 ? void 0 : driver.comparePassword(password))) === false)
                    return res.status(401).send({ message: "Erro: Username e/ou senha inválido." });
                driver === null || driver === void 0 ? void 0 : driver.set("password", undefined);
                return res.send({
                    message: "Login realizado com sucesso.",
                    driver,
                    token: this.generateAccessToken({ cpf: driver === null || driver === void 0 ? void 0 : driver.cpf }),
                });
            }
            catch (_a) {
                return res.status(400).send({ message: "Erro: Falha no login." });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, cpf } = req.body;
            if (!req.role && req.userCPF !== cpf)
                return res.status(401).send({ message: "Não autorizado." });
            try {
                var driver = yield Driver_1.default.findOne({ cpf }).select("+password");
                if (!driver)
                    return res.status(400).send({ message: "Erro: CPF não encontrado." });
                if (!newPassword || newPassword === "" || newPassword.length < 8 || newPassword.includes(" "))
                    return res.status(400).send({
                        message: "Erro: Senha inválida. Não pode ser vazio, não pode conter espaço em branco e deve conter ao menos 8 caracteres.",
                    });
                driver.password = newPassword;
                yield driver.save();
                return res.send({ message: "Senha alterada com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Erro: Falha na alteração da senha." });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = AuthDriverController;
