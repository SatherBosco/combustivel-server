"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFuel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbUserFuel = process.env.DB_USER_FUEL;
const dbPasswordFuel = process.env.DB_PASS_FUEL;
function DatabaseFuel() {
    mongoose_1.default
        .connect(`mongodb+srv://${dbUserFuel}:${dbPasswordFuel}@cluster0.xd0lovu.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
        console.log("Conectou ao banco de dados!");
    })
        .catch((err) => console.log(err));
    mongoose_1.default.Promise = global.Promise;
}
exports.DatabaseFuel = DatabaseFuel;
// const dbUserDashboard = process.env.DB_USER_DASHBOARD;
// const dbPasswordDashboard = process.env.DB_PASS_DASHBOARD;
// export function DatabaseDashboard() {
//     mongoose
//         .connect(`mongodb+srv://${dbUserDashboard}:${dbPasswordDashboard}@cluster0.3tj2idh.mongodb.net/r3database?retryWrites=true&w=majority`)
//         .then(() => {
//             console.log("Conectou ao banco de dados!");
//         })
//         .catch((err) => console.log(err));
//     mongoose.Promise = global.Promise;
// }
