"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Manager_1 = __importStar(require("../models/Manager"));
class AuthManagerController {
    generateAccessToken(params = {}) {
        return (0, jsonwebtoken_1.sign)(params, auth_json_1.default["manager-access"], {
            expiresIn: 86400,
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { cpf, firstName, lastName, password } = req.body;
            try {
                if (!req.role || (req.role !== Manager_1.Role.Director && req.role !== Manager_1.Role.Master))
                    return res.status(400).send({ message: "Erro: Não autorizado." });
                cpf = cpf.replace(" ", "");
                firstName = firstName.trim();
                lastName = lastName.trim();
                password = password.trim();
                if (!cpf || cpf === "" || cpf.length !== 11 || cpf.includes(" "))
                    return res.status(400).send({ message: "Erro: CPF inválido. Não pode ser vazio." });
                if (yield Manager_1.default.findOne({ cpf }))
                    return res.status(400).send({ message: "Erro: CPF já registrado." });
                if (!firstName || firstName === "" || firstName.length < 3)
                    return res.status(400).send({ message: "Erro: Primeiro nome inválido. Não pode ser vazio e deve conter ao menos 3 caracteres." });
                if (!lastName || lastName === "" || lastName.length < 3)
                    return res.status(400).send({ message: "Erro: Sobrenome inválido. Não pode ser vazio e deve conter ao menos 3 caracteres." });
                if (!password || password === "" || password.length < 8 || password.includes(" "))
                    return res
                        .status(400)
                        .send({
                        message: "Erro: Senha inválida. Não pode ser vazio, não pode conter espaço em branco e deve conter ao menos 8 caracteres.",
                    });
                var managerObj = {
                    cpf: cpf,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    role: Manager_1.Role.Manager,
                    unit: "R3T",
                };
                yield Manager_1.default.create(managerObj);
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
                var manager = yield Manager_1.default.findOne({ cpf }).select("+password");
                if (!manager || (yield (manager === null || manager === void 0 ? void 0 : manager.comparePassword(password))) === false)
                    return res.status(401).send({ message: "Erro: Username e/ou senha inválido." });
                manager === null || manager === void 0 ? void 0 : manager.set("password", undefined);
                return res.send({
                    message: "Login realizado com sucesso.",
                    manager,
                    token: this.generateAccessToken({ cpf: manager === null || manager === void 0 ? void 0 : manager.cpf, role: manager === null || manager === void 0 ? void 0 : manager.role }),
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
            if (!req.role || (req.role !== Manager_1.Role.Master && req.role !== Manager_1.Role.Director && req.userCPF !== cpf))
                return res.status(401).send({ message: "Não autorizado." });
            try {
                var manager = yield Manager_1.default.findOne({ cpf }).select("+password");
                if (!manager)
                    return res.status(400).send({ message: "Erro: CPF não encontrado." });
                if (!newPassword || newPassword === "" || newPassword.length < 8 || newPassword.includes(" "))
                    return res.status(400).send({
                        message: "Erro: Senha inválida. Não pode ser vazio, não pode conter espaço em branco e deve conter ao menos 8 caracteres.",
                    });
                manager.password = newPassword;
                yield manager.save();
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
exports.default = AuthManagerController;
