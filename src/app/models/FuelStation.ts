import mongoose from "mongoose";

export interface FuelStationInput {
    name: string;
    cnpj: string;
  }
  
  export interface FuelStationDocument extends FuelStationInput, mongoose.Document {
    createdAt: Date;
  }

const FuelStationSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    cnpj: {
      type: String,
      unique: true,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<FuelStationDocument>("FuelStation", FuelStationSchema);
