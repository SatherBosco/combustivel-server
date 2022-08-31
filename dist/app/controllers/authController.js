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
const User_1 = __importDefault(require("../models/User"));
function generateToken(params = {}) {
    return (0, jsonwebtoken_1.sign)(params, auth_json_1.default.secret, {
        // expiresIn: 86400,
        expiresIn: 31536000,
    });
}
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cpf, role } = req.body;
            try {
                if (!req.role || req.role >= role || req.role > 3) {
                    return res.status(401).send({ message: "Não autorizado." });
                }
                if (yield User_1.default.findOne({ cpf }))
                    return res.status(400).send({ message: "CPF já registrado." });
                var userObj = req.body;
                yield User_1.default.create(userObj);
                return res.send({ message: "Cadastro concluído com sucesso." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na criação do cadastro." });
            }
        });
    }
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cpf, password } = req.body;
            try {
                var user = yield User_1.default.findOne({ cpf }).select("+password");
                if (!user || (yield (user === null || user === void 0 ? void 0 : user.comparePassword(password))) === false) {
                    return res.status(400).send({ message: "Username e/ou senha inválido." });
                }
                user === null || user === void 0 ? void 0 : user.set("password", undefined);
                return res.send({
                    message: "OK",
                    user,
                    token: generateToken({ id: user === null || user === void 0 ? void 0 : user._id, role: user === null || user === void 0 ? void 0 : user.role }),
                });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha no login." });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, cpf } = req.body;
            try {
                if (!req.role)
                    return res.status(401).send({ message: "Não autorizado." });
                var user = yield User_1.default.findOne({ cpf }).select("+password");
                if (!user)
                    return res.status(400).send({ message: "CPF não encontrado." });
                if (req.role <= user.role) {
                    user.password = newPassword;
                    yield user.save();
                    return res.send({ message: "Senha alterada com sucesso." });
                }
                else
                    return res.status(400).send({ message: "Não autorizado." });
            }
            catch (_a) {
                return res.status(400).send({ message: "Falha na alteração da senha." });
            }
        });
    }
}
exports.default = new AuthController();
