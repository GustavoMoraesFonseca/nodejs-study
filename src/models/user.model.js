import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        unique: [true, 'Esse nome já existe.']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.']
    }
});

export const UserModel = model('User', userSchema);