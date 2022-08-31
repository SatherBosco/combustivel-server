import { google } from "googleapis";
import fs from "fs";
import path from "path";
import upload from "../middlewares/upload";

export interface DriveUploadStatus {
    sucess: boolean;
    message: string;
}

class DriveStorage {
    private GOOGLE_API_FOLDER_ID: string = "11aLYfc5fIR9VgsSTH7SfMZCh4J5VqYpL";

    async uploadFile(filename: string, contentType: string): Promise<DriveUploadStatus> {
        try {
            const originalPath = path.resolve(upload.directory, filename);

            const auth = new google.auth.GoogleAuth({
                keyFile: "./src/configs/googleConfigs.json",
                scopes: ["https://www.googleapis.com/auth/drive"],
            });

            const driveService = google.drive({
                version: "v3",
                auth,
            });

            const fileMetadata = {
                name: filename,
                parents: [this.GOOGLE_API_FOLDER_ID],
            };

            const media = {
                mimeType: contentType,
                body: fs.createReadStream(originalPath),
            };

            const response = await driveService.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id",
            });

            if (!response.data.id || response.data.id === undefined) return { sucess: false, message: "Erro no upload para o Drive" };

            return { sucess: true, message: response.data.id };
        } catch (error) {
            return { sucess: false, message: "Erro ao fazer upload da imagem" };
        }
    }
}

export default DriveStorage;
