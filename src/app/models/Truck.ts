import mongoose from "mongoose";

export interface TruckInput {
    licensePlate: string;
    odometer: number;
    capacity: number;
    average: number;
    unit: string;
}

export interface TruckDocument extends TruckInput, mongoose.Document {
    createdAt: Date;
}

const TruckSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        unique: true,
        required: true,
    },
    odometer: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    average: {
        type: Number,
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

export default mongoose.model<TruckDocument>("Truck", TruckSchema);
