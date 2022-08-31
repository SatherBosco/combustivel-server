import DriveStorage, { DriveUploadStatus } from "./googleDriveComponent";

class UploadImagesService {
  async execute(file: Express.Multer.File): Promise<DriveUploadStatus> {
    const driveStorage = new DriveStorage();

    const status = await driveStorage.uploadFile(file.filename, file.mimetype);

    return status;
  }
}

export default UploadImagesService;