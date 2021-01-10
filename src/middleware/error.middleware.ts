import type { NextFunction, Request, Response } from "express";

import type { IResponseError } from "~declarations/index.d";

export const notFoundError = (_req: Request, res:Response) => {
   res.status(404).json({
      ok: false,
      message: "the requested resource doesn't exist",
      data: null
   });
}

export const errorHandler = (error: IResponseError, _req: Request, res:Response, _next: NextFunction) => {
   const status = error.statusCode || error.status || 500;
   const message = error.message || "Internal server error";

   res.status(status).json({
      ok: false,
      message,
      data: null
   });
}
