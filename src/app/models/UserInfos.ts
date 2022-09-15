import mongoose from "mongoose";

export interface UserInfoInput {
    cpf: string;
    fullname: string;
    kmTraveled: number;
    average: number;
    lastAverage: number;
    award: number;
    referenceMonth: number;
}

export interface UserInfoDocument extends UserInfoInput, mongoose.Document {
    createdAt: Date;
}

const UserInfoSchema = new mongoose.Schema({
    cpf: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    kmTraveled: {
        type: Number,
        default: 0,
    },
    average: {
        type: Number,
        default: 0,
    },
    lastAverage: {
        type: Number,
        default: 0,
    },
    award: {
        type: Number,
        default: 0,
    },
    referenceMonth: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<UserInfoDocument>("UserInfo", UserInfoSchema);
