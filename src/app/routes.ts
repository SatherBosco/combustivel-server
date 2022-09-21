import { Router } from "express";
import authVerify from "./middlewares/auth";
import multer from "multer";

import HealthController from "./controllers/healthController";
import { AuthController } from "./controllers/authController";
import TruckController from "./controllers/truckController";
import FuelStationController from "./controllers/fuelStationController";
import UserInfoController from "./controllers/userInfoController";
import HistoricController from "./controllers/historicController";
import PriceController from "./controllers/priceController";

import uploadConfig from "./middlewares/upload";

export class Routes {
    routes: Router;
    upload: multer.Multer;

    constructor() {
        this.routes = Router();
        this.upload = multer(uploadConfig);
    }

    public initRoutes(): Router {
        // HEALTH -----------------------------------------------------------------------
        this.routes.get("/health/", HealthController.health);
        this.routes.get("/health/app-version", HealthController.appVersion);
        this.routes.get("/health/dashboard-version", HealthController.dashboardVersion);
        this.routes.get("/health/server-version", HealthController.serverVersion);

        // AUTH -------------------------------------------------------------------------
        const authController = new AuthController();
        this.routes.post("/auth/authenticate", authController.authenticate);
        this.routes.use(authVerify); // MIDDLEWARE JWT ---------------------------------------
        this.routes.post("/auth/register", authController.register);
        this.routes.post("/auth/change-password", authController.changePassword);

        // TRUCK ------------------------------------------------------------------------
        this.routes.get("/truck/", TruckController.getAll);
        this.routes.post("/truck/", TruckController.register);
        this.routes.put("/truck/", TruckController.update);
        this.routes.delete("/truck/", TruckController.delete);

        // FUEL STATION -----------------------------------------------------------------
        this.routes.get("/fuel-station/", FuelStationController.getAll);
        this.routes.post("/fuel-station/", FuelStationController.register);
        this.routes.put("/fuel-station/", FuelStationController.update);
        this.routes.delete("/fuel-station/", FuelStationController.delete);

        // USER INFOS -------------------------------------------------------------------
        this.routes.get("/user-infos/one/:cpf", UserInfoController.getOneDriver);
        this.routes.get("/user-infos/one-specific-month/:cpf&:dateMonth", UserInfoController.getOneDriverSpecificMonth);
        this.routes.get("/user-infos/all/:dateMonth", UserInfoController.getAllDrivers);

        // HISTORIC ---------------------------------------------------------------------
        this.routes.get("/historic/:initialDate&:finalDate", HistoricController.getAll);
        this.routes.get("/historic/by-truck/:initialDate&:finalDate&:truckLicensePlate", HistoricController.getAllByTruck);
        this.routes.get("/historic/by-user/:initialDate&:finalDate&:cpf", HistoricController.getAllByUser);
        this.routes.post(
            "/historic/",
            this.upload.fields([
                { name: "odometer", maxCount: 1 },
                { name: "nota", maxCount: 1 },
            ]),
            HistoricController.register
        );
        // routes.put("/historic/", HistoricController.update);
        this.routes.delete("/historic/", HistoricController.delete);

        // PRICE ------------------------------------------------------------------------
        this.routes.get("/price/:month", PriceController.getPrice);
        this.routes.post("/price/", PriceController.setPrice);
        this.routes.post("/att/", PriceController.att);

        return this.routes;
    }
}
