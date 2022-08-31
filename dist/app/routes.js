"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./middlewares/auth"));
const multer_1 = __importDefault(require("multer"));
const healthController_1 = __importDefault(require("./controllers/healthController"));
const authController_1 = __importDefault(require("./controllers/authController"));
const truckController_1 = __importDefault(require("./controllers/truckController"));
const fuelStationController_1 = __importDefault(require("./controllers/fuelStationController"));
const userInfoController_1 = __importDefault(require("./controllers/userInfoController"));
const historicController_1 = __importDefault(require("./controllers/historicController"));
const upload_1 = __importDefault(require("./middlewares/upload"));
const routes = (0, express_1.Router)();
const upload = (0, multer_1.default)(upload_1.default);
// HEALTH -----------------------------------------------------------------------
routes.get("/health/", healthController_1.default.health);
routes.get("/health/app-version", healthController_1.default.appVersion);
routes.get("/health/dashboard-version", healthController_1.default.dashboardVersion);
routes.get("/health/server-version", healthController_1.default.serverVersion);
// AUTH -------------------------------------------------------------------------
routes.post("/auth/authenticate", authController_1.default.authenticate);
routes.use(auth_1.default); // MIDDLEWARE JWT ---------------------------------------
routes.post("/auth/register", authController_1.default.register);
routes.post("/auth/change-password", authController_1.default.changePassword);
// TRUCK ------------------------------------------------------------------------
routes.get("/truck/", truckController_1.default.getAll);
routes.get("/truck/:truckLicensePlate", truckController_1.default.getOne);
routes.post("/truck/", truckController_1.default.register);
routes.put("/truck/", truckController_1.default.update);
routes.delete("/truck/", truckController_1.default.delete);
// FUEL STATION -----------------------------------------------------------------
routes.get("/fuel-station/", fuelStationController_1.default.getAll);
routes.post("/fuel-station/", fuelStationController_1.default.register);
routes.put("/fuel-station/", fuelStationController_1.default.update);
routes.delete("/fuel-station/", fuelStationController_1.default.delete);
// USER INFOS -------------------------------------------------------------------
routes.get("/user-infos/one/:cpf", userInfoController_1.default.getOneDriver);
routes.get("/user-infos/one-specific-month/:cpf&:dateMonth", userInfoController_1.default.getOneDriverSpecificMonth);
routes.get("/user-infos/all/:dateMonth", userInfoController_1.default.getAllDrivers);
// HISTORIC ---------------------------------------------------------------------
routes.get("/historic/:initialDate&:finalDate", historicController_1.default.getAll);
routes.get("/historic/by-truck/:initialDate&:finalDate&:truckLicensePlate", historicController_1.default.getAllByTruck);
routes.get("/historic/by-user/:initialDate&:finalDate&:cpf", historicController_1.default.getAllByUser);
routes.post("/historic/", upload.fields([{ name: 'odometer', maxCount: 1 }, { name: 'nota', maxCount: 1 }]), historicController_1.default.register);
// routes.put("/historic/", HistoricController.update);
routes.delete("/historic/", historicController_1.default.delete);
exports.default = routes;
