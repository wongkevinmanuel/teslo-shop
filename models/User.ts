import mongoose, { Schema, model, Model} from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema({
    name : { type:String, required: true },
    email : { type:String, required: true, unique: true},
    password : { type:String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            message: '{VALUE} no es un valor valido',
            default: 'client',
            required: true
        }
    }
}, {
    timestamps: true, 
})

//Definir el modelo         Si ya existe en moongose el modelo de usuario es se maneja si no lo crea
const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;