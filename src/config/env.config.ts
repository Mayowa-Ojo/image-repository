import dotenv from "dotenv";

import type { IEnvConfig } from "~declarations/index.d";

const isProduction = process.env.NODE_ENV === "production";

dotenv.config({ 
   path: isProduction ? ".env.production" : ".env.development"
});

export const config: IEnvConfig = {
   PORT: process.env.PORT || 6000,
   NODE_ENV: process.env.NODE_ENV || "development",
   API_VERSION: process.env.API_VERSION,
   LOG_FILE: process.env.LOG_FILE || "server.log",
   DB_URI: process.env.DB_URI,
   DB_NAME: process.env.DB_NAME,
   DB_USER: process.env.DB_USER,
   DB_PASSWORD: process.env.DB_PASSWORD,
   JWT_SECRET: process.env.JWT_SECRET,
   AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
   AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
   AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
   AWS_REGION: process.env.AWS_REGION
}