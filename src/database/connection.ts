import mongoose, { ConnectOptions } from "mongoose";

const connection = mongoose.createConnection(process.env.MONGODB_URI, {
  poolSize: 10,
  maxTimeMS: 3,
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions);

connection.on("error", (error) => {
  console.error(error);
});

export default connection;
