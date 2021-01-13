import type { Request, Response, NextFunction } from "express";
import type Aws from "aws-sdk";

import User from "~entity/user.entity";
import Image from "~entity/image.entity";


declare interface IEnvConfig {
   PORT: string | number
   NODE_ENV: string
   API_VERSION: string | number
   LOG_FILE: string
   DB_URI: string
   DB_NAME: string
   DB_USER: string
   DB_PASSWORD: string
   JWT_SECRET: string
   AWS_ACCESS_KEY_ID: string
   AWS_SECRET_ACCESS_KEY: string
   AWS_REGION: string
   AWS_S3_BUCKET: string
}

declare type IBaseEntity = User | Image

declare interface IRepositoryPayload {
   data?: any
   query?: any
   update?: any
   relations?: string | string[]
}

declare interface IJwtPayload {
   id: string
   email: string
}

declare type AsyncHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void>

type AsyncUpload = (
   params: Aws.S3.PutObjectRequest, options?: Aws.S3.ManagedUpload.ManagedUploadOptions
) => Promise<Aws.S3.ManagedUpload.SendData>

type AsyncDeleteObject = (
   params: Aws.S3.DeleteObjectRequest
) => Promise<Aws.S3.DeleteObjectOutput>