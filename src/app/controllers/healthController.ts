import { Request, Response } from "express";

class HealthController {
    public async health(req: Request, res: Response): Promise<Response> {
        return res.send({ message: "OK" });
    }

    public async appVersion(req: Request, res: Response): Promise<Response> {
        return res.send({ message: "1.1.0" });
    }

    public async dashboardVersion(req: Request, res: Response): Promise<Response> {
        return res.send({ message: "1.0.0" });
    }

    public async serverVersion(req: Request, res: Response): Promise<Response> {
        return res.send({ message: "1.0.0" });
    }
}

export default new HealthController();
