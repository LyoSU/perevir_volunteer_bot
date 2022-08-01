import mongoose from "mongoose";

export const connectMongoose = () => {
  return mongoose.connect(process.env.DB_URL);
};
