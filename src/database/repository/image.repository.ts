import { getRepository, Repository, DeleteResult, UpdateResult } from "typeorm";

import Image from "~entity/image.entity";
import { IBaseEntity, IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<Image>

export const create = async ({ data }: IRepositoryPayload): Promise<Image> => {
   try {
      repository = getRepository(Image);

      const imageInstance = new Image();

      populateEntityFields(imageInstance, data);

      const image = await repository.save(imageInstance);

      return image;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const insertMany = async ({ data }: IRepositoryPayload): Promise<Image[]> => {
   try {
      repository = getRepository(Image);

      const imageInstances = data.map(() => new Image());

      imageInstances.forEach((instance: IBaseEntity, idx: number) => populateEntityFields(instance, data[idx]));

      const images = await repository.insert(imageInstances);

      return images as unknown as Image[];
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: any): Promise<Image> => {
   try {
      repository = getRepository(Image);

      const [image] = await repository.find({ ...query });

      return image;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query, relations }: IRepositoryPayload): Promise<Image> => {
   try {
      repository = getRepository(Image);
      const validRelations = ["owner"];

      if(relations && relations.length >= 1) {
         // cast relations param to an array if string is provided
         if(!Array.isArray(relations)) relations = [relations];
         // check if every relation passed is valid
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const image = await repository.findOne(query.id, { relations });

         return image;
      }

      const image = await repository.findOne(query.id);

      return image;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query, relations }: IRepositoryPayload): Promise<Image[]> => {
   try {
      repository = getRepository(Image);
      const validRelations = ["owner"];
      let images: Image[];

      if(relations && relations.length >= 1) {
         // cast relations param to an array if string is provided
         if(!Array.isArray(relations)) relations = [relations];
         // check if every relation passed is valid
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         if(Array.isArray(query.ids)) {
            images = await repository.findByIds(query.ids, { relations });
            return images;
         }

         images = await repository.find({ ...query, relations });
         return images;
      }

      if(Array.isArray(query.ids)) {
         images = await repository.findByIds(query.ids);
         return images;
      }

      images = await repository.find({ ...query });
      return images;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<UpdateResult> => {
   try {
      repository = getRepository(Image);
      const updateResult = await repository.update(query, update);

      return updateResult;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<DeleteResult> => {
   try {
      repository = getRepository(Image);
      const result = await repository.delete(query);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteMany = async ({ query }: IRepositoryPayload): Promise<DeleteResult> => {
   try {
      repository = getRepository(Image);
      const result = await repository.delete(query);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}