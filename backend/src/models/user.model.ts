import mongoose, { Schema, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true }
})

export const User = mongoose.model<IUser>('User', UserSchema)