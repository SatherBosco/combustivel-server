import { Router } from "express";
import authVerify from "./middlewares/auth";
import multer from "multer";

import HealthController from "./controllers/healthController";
import AuthController from "./controllers/authController";
import TruckController from "./controllers/truckController";
import FuelStationController from "./controllers/fuelStationController";
import UserInfoController from "./controllers/userInfoController";
import HistoricController from "./controllers/historicController";
import PriceController from "./controllers/priceController";
import MaintenanceController from "./controllers/maintenanceController";

import uploadConfig from "./middlewares/upload";

const routes = Router();

const upload = multer(uploadConfig);

// HEALTH -----------------------------------------------------------------------
routes.get("/health/", HealthController.health);
routes.get("/health/app-version", HealthController.appVersion);
routes.get("/health/dashboard-version", HealthController.dashboardVersion);
routes.get("/health/server-version", HealthController.serverVersion);

// AUTH -------------------------------------------------------------------------
routes.post("/auth/authenticate", AuthController.authenticate);
routes.use(authVerify); // MIDDLEWARE JWT ---------------------------------------
routes.post("/auth/register", AuthController.register);
routes.post("/auth/change-password", AuthController.changePassword);

// TRUCK ------------------------------------------------------------------------
routes.get("/truck/", TruckController.getAll);
routes.get("/truck/:truckLicensePlate", TruckController.getOne);
routes.post("/truck/", TruckController.register);
routes.put("/truck/", TruckController.update);
routes.delete("/truck/", TruckController.delete);

// FUEL STATION -----------------------------------------------------------------
routes.get("/fuel-station/", FuelStationController.getAll);
routes.post("/fuel-station/", FuelStationController.register);
routes.put("/fuel-station/", FuelStationController.update);
routes.delete("/fuel-station/", FuelStationController.delete);

// USER INFOS -------------------------------------------------------------------
routes.get("/user-infos/one/:cpf", UserInfoController.getOneDriver);
routes.get("/user-infos/all-of-one/:cpf", UserInfoController.getAllOfOneDriver);
routes.get("/user-infos/one-specific-month/:cpf&:dateMonth", UserInfoController.getOneDriverSpecificMonth);
routes.get("/user-infos/all/:dateMonth", UserInfoController.getAllDrivers);

// HISTORIC ---------------------------------------------------------------------
routes.get("/historic/:initialDate&:finalDate", HistoricController.getAll);
routes.get("/historic/by-truck/:initialDate&:finalDate&:truckLicensePlate", HistoricController.getAllByTruck);
routes.get("/historic/by-user/:initialDate&:finalDate&:cpf", HistoricController.getAllByUser);
routes.post(
    "/historic/",
    upload.fields([
        { name: "odometer", maxCount: 1 },
        { name: "nota", maxCount: 1 },
    ]),
    HistoricController.register
);
// routes.put("/historic/", HistoricController.update);
routes.delete("/historic/", HistoricController.delete);

// PRICE ------------------------------------------------------------------------
routes.get("/price/:month", PriceController.getPrice);
routes.post("/price/", PriceController.setPrice);

// MANUTENCAO -------------------------------------------------------------------
routes.get("/maintenance/", MaintenanceController.getAll);
routes.get("/maintenance/:initialDate&:finalDate&:cpf", MaintenanceController.getAllByUser);
routes.post(
    "/maintenance/",
    upload.fields([
        { name: "imageOne", maxCount: 1 },
        { name: "imageTwo", maxCount: 1 },
        { name: "imageThree", maxCount: 1 },
    ]),
    MaintenanceController.create
);
routes.post(
    "/maintenance/:protocol",
    upload.fields([
        { name: "imageOne", maxCount: 1 },
        { name: "imageTwo", maxCount: 1 },
        { name: "imageThree", maxCount: 1 },
    ]),
    MaintenanceController.update
);

export default routes;
