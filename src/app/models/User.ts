import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserInput {
    cpf: string;
    firstName: string;
    lastName: string;
    password: string;
    role: number;
    truckLicensePlate: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
    fullName: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
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
    role: {
        type: Number,
        required: true,
        default: 4,
    },
    truckLicensePlate: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.virtual("fullName").get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

export default mongoose.model<UserDocument>("User", UserSchema);
