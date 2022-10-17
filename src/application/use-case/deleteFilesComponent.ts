import fs from "fs";
import path from "path";
import upload from "../../infra/express/middlewares/upload";

class DeleteFiles {
    async delete(fileName: string) {
        try {
            const directory = upload.directory;

            fs.unlink(path.join(directory, fileName), (err) => {
                if (err) throw err;
            });
        } catch (error) {
            console.log(error);
        }
    }
    // async delete() {
    //     try {
    //         const directory = upload.directory;

    //         fs.readdir(directory, (err, files) => {
    //             if (err) throw err;

    //             for (const file of files) {
    //                 fs.unlink(path.join(directory, file), (err) => {
    //                     if (err) throw err;
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}

export default DeleteFiles;
