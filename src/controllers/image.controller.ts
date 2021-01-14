import util from "util";
import codes from "http-status-codes";
import { nanoid } from "nanoid";
import * as Aws from "aws-sdk";

import { AsyncHandler, AsyncUpload, AsyncDeleteObject } from "~declarations/index";
import { config } from "~config/env.config";
import { ResponseError } from "~utils/index";
import * as imageRepository from "~repository/image.repository";
import { Permissions } from "~declarations/enums";


const s3 = new Aws.S3({
   credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
   },
   region: config.AWS_REGION
});

const asyncUpload: AsyncUpload = util.promisify(s3.upload).bind(s3);
const asyncDeleteObject: AsyncDeleteObject = util.promisify(s3.deleteObject).bind(s3);

export const upload: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const files = <Express.Multer.File[]>req.files;

   if(files.length < 1) {
      error.message = "No file found";
      next(error);

      return;
   }

   const uploadPromise = (file: Express.Multer.File) => asyncUpload({
      Bucket: config.AWS_S3_BUCKET,
      Body: file.buffer,
      Key: `images/${file.originalname}-${nanoid(8)}`,
      ContentType: file.mimetype
   });

   try {
      const promises = files.map(file => uploadPromise(file));
      const response = await Promise.all(promises);
      const { user } = res.locals;

      const uploadResult = response.map(el => ({
         key: el.Key,
         url: el.Location,
         owner: user.id
      }));

      const insertResult = await imageRepository.insertMany({ data: uploadResult });
      const ids = insertResult.identifiers.map<string>(obj => obj.id);
      const images = await imageRepository.find({ query: { ids }});

      res.status(codes.CREATED).json({
         ok: true,
         message: "files uploaded",
         data: {
            images
         }
      });
   } catch (err) {
      next(error);
   }
}

export const deleteOne: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const id = req.params["id"];

   if(!id) {
      error.message = "missing/malformed field in request param"
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const image = await imageRepository.findById({ query: { id }, relations: "owner"});
      const { user } = res.locals;

      // ensure access control
      if(user.id !== image.owner.id) {
         error.message = "user is not authorized";
         error.statusCode = codes.FORBIDDEN;

         throw error;
      }

      await asyncDeleteObject({
         Bucket: config.AWS_S3_BUCKET,
         Key: image.key,
      });

      await imageRepository.deleteOne({
         query: { id }
      });


      res.status(codes.OK).json({
         ok: true,
         message: "image successfully deleted",
         data: null
      })
   } catch (err) {
      next(error);
   }
}

export const deleteMany: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const ids = req.query["ids"];

   if(!ids) {
      error.message = "missing/malformed field in request query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(!Array.isArray(ids)) {
      error.message = "invalid query format";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   const deletePromise = (key: string) => asyncDeleteObject({
      Bucket: config.AWS_S3_BUCKET,
      Key: key,
   });

   try {
      const images = await imageRepository.find({ query: { ids }, relations: "owner"});
      const promises = images.map(image => deletePromise(image.key));
      const { user } = res.locals;

      // ensure access control
      const isAuthorized = images.every(image => user.id === image.owner.id);
      if(!isAuthorized) {
         error.message = "user is not authorized";
         error.statusCode = codes.FORBIDDEN;

         throw error;
      }

      await Promise.all(promises);
      await imageRepository.deleteMany({ query: ids });

      res.status(codes.OK).json({
         ok: true,
         message: "resources successfully deleted",
         data: null
      });
   } catch (err) {
      next(error);
   }
}

export const deleteAll: AsyncHandler = async (_req, res, next) => {
   const error = new ResponseError;
   const { user } = res.locals;

   try {
      await imageRepository.deleteMany({ query: { owner: user.id }});

      res.status(codes.OK).json({
         ok: true,
         message: "resources successfully deleted",
         data: null
      });
   } catch (err) {
      next(error);
   }
}

export const editPermission: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const id = req.params["id"];
   const { user } = res.locals;
   const { permission } = req.body;

   if(!id) {
      error.message = "missing/malformed field in request query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(!Object.values(Permissions).includes(permission)) {
      error.message = "invalid permission type";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const image = await imageRepository.findById({ query: { id }, relations: "owner" });

      // ensure access control
      if(user.id !== image.owner.id) {
         error.message = "user is not authorized";
         error.statusCode = codes.FORBIDDEN;

         throw error;
      }

      await imageRepository.updateOne({
         query: { id },
         update: { permission }
      });

      const updatedImage = await imageRepository.findById({ query: { id }});

      res.status(codes.OK).json({
         ok: true,
         message: "resource successfully updated",
         data: updatedImage
      });
   } catch (err) {
      next(error);
   }
}