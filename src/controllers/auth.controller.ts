import codes from "http-status-codes";

import { generateAuthToken, ResponseError, verifyPassword } from "~utils/index";
import type { AsyncHandler } from "~declarations/index.d";
import * as userRepository from "~repository/user.repository";

export const login: AsyncHandler = async (req, res, next) => {
   const requestBody = req.body;
   const { email, password } = requestBody;
   const error = new ResponseError;

   if(!email || !password) {
      error.message = "missing/invalid field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const user = await userRepository.findOne({
         query: { email }
      });

      if(!user) {
         error.message = "invalid credentials";
         error.statusCode = codes.UNAUTHORIZED;

         throw error;
      }

      const isValid = await verifyPassword(password, user.password);

      if(!isValid) {
         error.message = "invalid credentials";
         error.statusCode = codes.UNAUTHORIZED;

         throw error;
      }

      const token = generateAuthToken("7d", { id: user.id, email: user.email });

      res.status(codes.OK).json({
         ok: true,
         message: "user logged in...",
         data: {
            user,
            token
         }
      });

      return;
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const signup: AsyncHandler = async (req, res, next) => {
   const requestBody = req.body;
   const { firstname, lastname, email, password } = requestBody;
   const error = new ResponseError;

   if(![firstname, lastname, email, password].every(Boolean)) {
      error.message = "missing/invalid field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const user = await userRepository.create({
         data: {
            firstname,
            lastname,
            email,
            password
         }
      });

      const token = generateAuthToken("7d", { id: user.id, email: user.email });

      res.status(codes.OK).json({
         ok: true,
         message: "user signed up...",
         data: {
            user,
            token
         }
      });

      return;
   } catch (err) {
      if(err.message.includes("duplicate key")) {
         error.message = "user already exists";
         error.statusCode = codes.BAD_REQUEST;

         next(error);
         return;
      }
      error.message = err.message;
      next(error);
   }
}