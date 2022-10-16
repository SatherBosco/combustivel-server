import mongoose from "mongoose";

export interface PriceInput {
    price: number;
    referenceMonth: number;
    unit: string;
}

export interface PriceDocument extends PriceInput, mongoose.Document {
    createdAt: Date;
}

const PriceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    referenceMonth: {
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

export default mongoose.model<PriceDocument>("Price", PriceSchema);
