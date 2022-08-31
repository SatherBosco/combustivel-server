"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const HistoricSchema = new mongoose_1.default.Schema({
    truckLicensePlate: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    referenceMonth: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    fuelStationName: {
        type: String,
        required: true,
    },
    previousOdometer: {
        type: Number,
        required: true,
    },
    currentOdometer: {
        type: Number,
        required: true,
    },
    liters: {
        type: Number,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    km: {
        type: Number,
        required: true,
    },
    average: {
        type: Number,
        required: true,
    },
    odometerImage: {
        type: String,
        required: true,
    },
    invoiceImage: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Historic", HistoricSchema);