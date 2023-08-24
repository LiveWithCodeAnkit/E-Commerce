import mongoose from "mongoose";

let connection: typeof mongoose;

const url: any = process.env.MONGO_URL;

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (error) {
    throw new Error((error as any).message);
  }
};

export default startDb;
