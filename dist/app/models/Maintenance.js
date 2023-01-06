"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MaintenanceSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    truckLicensePlate: {
        type: String,
        required: true,
    },
    cartLicensePlate: {
        type: String,
    },
    odometer: {
        type: Number,
        required: true,
    },
    occurrence: {
        type: String,
        required: true,
    },
    occurrenceDescription: {
        type: String,
        required: true,
    },
    occurrenceImageOne: {
        type: String,
    },
    occurrenceImageTwo: {
        type: String,
    },
    occurrenceImageThree: {
        type: String,
    },
    actionStatus: {
        type: String,
    },
    actionDescription: {
        type: String,
    },
    actionImageOne: {
        type: String,
    },
    actionImageTwo: {
        type: String,
    },
    actionImageThree: {
        type: String,
    },
    closedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Maintenance", MaintenanceSchema);
