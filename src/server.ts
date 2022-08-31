import "dotenv/config";
import { App } from "./app/app";

new App().server.listen(3333, () => console.log("Server is running in Dev mode, Port: 3333"));
