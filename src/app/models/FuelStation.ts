import mongoose from "mongoose";

export interface FuelStationInput {
    name: string;
    cnpj: string;
    unit: string;
}

export interface FuelStationDocument extends FuelStationInput, mongoose.Document {
    createdAt: Date;
}

const FuelStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cnpj: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<FuelStationDocument>("FuelStation", FuelStationSchema);
