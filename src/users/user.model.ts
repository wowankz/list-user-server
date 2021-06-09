import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  f_name: { type: String, required: true },
  s_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  phone: { type: Number, required: true },
});

export interface User extends mongoose.Document {
  id: string;
  f_name: string;
  s_name: string;
  email: string;
  phone: number;
  avatar: string;
}
