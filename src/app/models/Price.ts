import mongoose from "mongoose";

export interface PriceInput {
    price: number;
    monthDate: number;
  }
  
  export interface PriceDocument extends PriceInput, mongoose.Document {
    createdAt: Date;
  }

const PriceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    monthDate: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<PriceDocument>("Price", PriceSchema);
