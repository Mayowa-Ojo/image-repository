import { Request, Response, NextFunction } from "express";
import { transports, format } from "winston";

export const logger = (winstonInstance: any): any => {
   winstonInstance.configure({
      level: "info",
      transports: [
         // - Write to all logs with specified level to console.
         new transports.Console({
            format: format.combine(
               format.colorize(),
               format.simple()
            )
         })
      ]
   });

   return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

      const start = new Date().getTime();

      await next();

      const ms = new Date().getTime() - start;

      let logLevel: string;
      if (res.statusCode >= 500) {
         logLevel = "error";
      } else if (res.statusCode >= 400) {
         logLevel = "warn";
      } else {
         logLevel = "info";
      }

      const msg = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`;

      winstonInstance.log(logLevel, msg);
   };
};