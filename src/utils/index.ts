import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import codes from "http-status-codes";

import { config } from "~config/env.config";
import type { IBaseEntity, IJwtPayload } from "~declarations/index.d";

export class ResponseError extends Error {
   status: number;
   statusCode: number;

   constructor() {
      super();
      this.status = codes.INTERNAL_SERVER_ERROR;
      this.statusCode = codes.INTERNAL_SERVER_ERROR;
   }
}

/**
 * create a hashed version of the given password
 */
export const hashPassword = async (password: string): Promise<string> => {
   try {
      const hash = await bcrypt.hash(password, 12);

      return hash;
   } catch (err) {
      throw new Error(err);
   }
}

/**
 * verify that the password provided is consistent with the hashed version
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
   try {
      const isValid = await bcrypt.compare(password, hash);

      return isValid;
   } catch (err) {
      throw new Error(err);
   }
}

/**
 * populates the fields of a new entity instance with given data
 * @param entity - instance of entity class to be populated
 * @param data - entity properties and values [properties shoould directly align with defined entity]
 */
export const populateEntityFields = <IData>(entity: IBaseEntity, data: IData): void => {
   Object.entries(data).map(([field, value]) => {
      entity[field] = value
   });

   return;
}

/**
 * Generates an auth token for current user
 * @param expiresIn - duration before token expires
 * @param payload - data to be stored inside token
 */
export const generateAuthToken = (expiresIn: string, payload: IJwtPayload): string => {
   try {
      const options: jwt.SignOptions = {
         expiresIn
      }

      const token = jwt.sign(payload, config.JWT_SECRET, options);

      return token;
   } catch (err) {
      throw new Error(err);
   }
}