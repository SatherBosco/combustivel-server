import { Response, Request } from "express";
import DeleteFiles from "../components/deleteFilesComponent";
import UploadImagesService from "../components/uploadImagesComponents";
import Maintenance, { MaintenanceInput } from "../models/Maintenance";
import User from "../models/User";

class MaintenanceController {
    public async getAll(req: Request, res: Response) {
        try {
            var maintenance = await Maintenance.find({});

            return res.send({ message: "Lista recuperada do banco de dados.", maintenance });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista." });
        }
    }

    public async getAllByUser(req: Request, res: Response) {
        try {
            var maintenance = await Maintenance.find({ cpf: req.userCPF });

            return res.send({ message: "Lista recuperada do banco de dados.", maintenance });
        } catch {
            return res.status(400).send({ message: "Falha na solicitação da lista." });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { truckLicensePlate, cartLicensePlate, odometer, occurrence, occurrenceDescription } = req.body;

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const deleteFiles = new DeleteFiles();

            if (!files || files === undefined || !files["imageOne"]) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem arquivo." });
            }

            if (!req.role || req.role !== 4) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem permissão." });
            }

            const user = await User.findOne({ cpf: req.userCPF });
            if (!user) return res.status(400).send({ message: "CPF não encontrado." });

            const uploadImagesService = new UploadImagesService();

            const auxDriver = { sucess: true, message: "" };

            const imageOne = await uploadImagesService.execute(files["imageOne"][0]);
            const imageTwo = !files["imageTwo"] ? auxDriver : await uploadImagesService.execute(files["imageTwo"][0]);
            const imageThree = !files["imageThree"] ? auxDriver : await uploadImagesService.execute(files["imageThree"][0]);
            deleteFiles.delete();

            if (!imageOne.sucess || !imageTwo.sucess || !imageThree.sucess) return res.status(400).send({ message: "Erro no upload." });

            var maintenanceObj = {
                fullName: user.fullName,
                cpf: req.userCPF ?? "",
                truckLicensePlate: truckLicensePlate,
                cartLicensePlate: cartLicensePlate ?? "",
                odometer: odometer,
                occurrence: occurrence,
                occurrenceDescription: occurrenceDescription,
                occurrenceImageOne: imageOne.message,
                occurrenceImageTwo: imageTwo.message,
                occurrenceImageThree: imageThree.message,
            };

            await Maintenance.create(maintenanceObj);

            return res.send({ message: "Criado." });
        } catch {
            return res.status(400).send({ message: "Falha na criação." });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, actionStatus, actionDescription, actionImageOne, actionImageTwo, actionImageThree } = req.body;

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const deleteFiles = new DeleteFiles();

            if (!files || files === undefined || !files["imageOne"]) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem arquivo." });
            }

            if (!req.role || req.role !== 4) {
                deleteFiles.delete();
                return res.status(400).send({ message: "Sem permissão." });
            }

            const occurrence = await Maintenance.findOne({ _id: id });
            if (!occurrence) return res.status(400).send({ message: "Ocorrencia não encontrada." });

            const uploadImagesService = new UploadImagesService();

            const auxDriver = { sucess: true, message: "" };

            const imageOne = await uploadImagesService.execute(files["imageOne"][0]);
            const imageTwo = !files["imageTwo"] ? auxDriver : await uploadImagesService.execute(files["imageTwo"][0]);
            const imageThree = !files["imageThree"] ? auxDriver : await uploadImagesService.execute(files["imageThree"][0]);
            deleteFiles.delete();

            if (!imageOne.sucess || !imageTwo.sucess || !imageThree.sucess) return res.status(400).send({ message: "Erro no upload." });

            occurrence.actionStatus = actionStatus ?? "";
            occurrence.actionDescription = actionDescription ?? "";
            occurrence.actionImageOne = actionImageOne ?? "";
            occurrence.actionImageTwo = actionImageTwo ?? "";
            occurrence.actionImageThree = actionImageThree ?? "";

            if (actionDescription.lenght > 0) occurrence.closedAt = new Date();

            await occurrence.save();

            return res.send({ message: "Atualizado." });
        } catch {
            return res.status(400).send({ message: "Falha na atualização." });
        }
    }
}

export default new MaintenanceController();
