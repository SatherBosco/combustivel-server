import mongoose from "mongoose";

export interface CartInput {
    licensePlate: string;
    standartTruckLicensePlate: string;
}

export interface CartDocument extends CartInput, mongoose.Document {
    createdAt: Date;
}

const CartSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        unique: true,
        required: true,
    },
    standartCartLicensePlate: {
        type: String,
    },
});

export default mongoose.model<CartDocument>("Cart", CartSchema);
