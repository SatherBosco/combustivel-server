import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DriverProps } from "../../../domain/driver/entity/driver.entity";

export interface DriverInput {
    cpf: string;
    firstName: string;
    lastName: string;
    password: string;
    licensePlate: string;
    unit: string;
}

export interface DriverDocument extends DriverProps, mongoose.Document {
    fullName: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const DriverSchema = new mongoose.Schema({
    cpf: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    licensePlate: {
        type: String,
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

DriverSchema.virtual("fullName").get(function (this: DriverDocument) {
    return `${this.firstName} ${this.lastName}`;
});

DriverSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

DriverSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const driver = this as DriverDocument;

    return bcrypt.compare(candidatePassword, driver.password).catch((e) => false);
};

export default mongoose.model<DriverDocument>("Driver", DriverSchema);
