import type { Request } from "express";

declare interface IEnvConfig {
   PORT: string | number
   NODE_ENV: string
   API_VERSION: string | number
   DB_URI: string
   DB_NAME: string
   DB_USER: string
   DB_PASSWORD: string
}

declare interface IResponseError extends Error {
   statusCode: number
   status: number
}