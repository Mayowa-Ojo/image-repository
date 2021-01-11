import { createConnection } from "typeorm";

const connectDB = async () => {

   try {
      await createConnection();

      console.log("[INFO] --typeorm: connected to database");
   } catch (err) {
      console.error(`[ERROR] --typeorm: ${err.message}`);
   }
}

export default connectDB;