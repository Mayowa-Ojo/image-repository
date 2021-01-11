import "reflect-metadata";

import app from "./app";
import connectDB from "~config/db.config";
import { config } from "~config/env.config";

void async function() {
   await connectDB();

   app.listen(config.PORT);

   console.log(`[INFO]: ${config.NODE_ENV} sever started. Available at ==> http://localhost:${config.PORT}/api/v1`);
}();