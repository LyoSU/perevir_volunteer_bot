import mongoose, { Schema } from "mongoose";

export type User = mongoose.Document & {
  telegram_id: number;
  first_name: string;
  last_name: string;
  username: string;
};

const UserSchema = new Schema({
  telegram_id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
});

export default mongoose.model<User>("User", UserSchema);
