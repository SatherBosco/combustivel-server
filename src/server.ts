import "dotenv/config";
import App from "./infra/express/app";

new App().server.listen(3333, () => console.log("Server is running! Port: 3333"));
