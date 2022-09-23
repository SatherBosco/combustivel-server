import mongoose from "mongoose";

export interface HistoricInput {
    fullName: string;
    cpf: string;
    truckLicensePlate: string;
    date: Date;
    referenceMonth: number;
    fuelStationName: string;
    cnpj: string;
    previousOdometer: number;
    currentOdometer: number;
    liters: number;
    value: number;
    km: number;
    average: number;
    standardAverage: number;
    arlaLiters: number;
    arlaPrice: number;
    odometerImage: string;
    invoiceImage: string;
}

export interface HistoricDocument extends HistoricInput, mongoose.Document {
    createdAt: Date;
}

const HistoricSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
    },
    referenceMonth: {
        type: Number,
        required: true,
    },
    fuelStationName: {
        type: String,
        required: true,
    },
    cnpj: {
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
    standardAverage: {
        type: Number,
        required: true,
    },
    arlaLiters: {
        type: Number,
        default: 0,
    },
    arlaPrice: {
        type: Number,
        default: 0,
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

export default mongoose.model<HistoricDocument>("Historic", HistoricSchema);
