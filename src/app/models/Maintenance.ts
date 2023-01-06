import mongoose from "mongoose";

export interface MaintenanceInput {
    fullName: string;
    cpf: string;
    truckLicensePlate: string;
    cartLicensePlate?: string;
    odometer: number;
    occurrence: string;
    occurrenceDescription: string;
    occurrenceImageOne: string;
    occurrenceImageTwo?: string;
    occurrenceImageThree?: string;
    actionStatus?: string;
    actionDescription?: string;
    actionImageOne?: string;
    actionImageTwo?: string;
    actionImageThree?: string;
    closedAt?: Date;
}

export interface MaintenanceDocument extends MaintenanceInput, mongoose.Document {
    createdAt: Date;
}

const MaintenanceSchema = new mongoose.Schema({
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

export default mongoose.model<MaintenanceDocument>("Maintenance", MaintenanceSchema);
