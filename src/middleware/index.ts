import codes from "http-status-codes";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import logger from "~config/logger.config";
import { config } from "~config/env.config";
import { ResponseError } from "~utils/index";
import type { IJwtPayload } from "~declarations/index";

export const notFoundError = (req: Request, res:Response) => {
   logger.error(`${req.method} | 404 | ${req.originalUrl} | ${req.ip} | Not Found`);

   res.status(404).json({
      ok: false,
      message: "the requested resource doesn't exist",
      data: null
   });
}

export const errorHandler = (error: ResponseError, req: Request, res:Response, _next: NextFunction) => {
   const status = error.statusCode || error.status || 500;
   const message = error.message || "Internal server error";

   logger.error(`${req.method} | ${status} | ${req.originalUrl} | ${req.ip} | ${message}`);

   res.status(status).json({
      ok: false,
      message,
      data: null
   });
}

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
   const error = new ResponseError;

   if(!req.headers["authorization"]) {
      error.message = "user is not authorized";
      error.statusCode = codes.UNAUTHORIZED;

      next(error);
      return;
   }

   const token = req.headers["authorization"].split(" ")[1];

   try {
      const payload = <IJwtPayload>jwt.verify(token, config.JWT_SECRET);
      res.locals.user = {
         id: payload.id,
         email: payload.email
      };

      next();
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}
