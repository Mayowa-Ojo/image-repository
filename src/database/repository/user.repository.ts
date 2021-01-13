import { getRepository, Repository } from "typeorm";

import User from "~entity/user.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<User>

export const create = async ({ data }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);

      const userInstance = new User();

      populateEntityFields(userInstance, data);

      const newUser = await repository.save(userInstance);

      return newUser;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: any): Promise<User> => {
   try {
      repository = getRepository(User);

      const [user] = await repository.find({ ...query });

      return user;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query, relations }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);
      const validRelations = ["images"];

      if(relations && relations.length >= 1) {
         // cast relations param to an array if string is provided
         if(!Array.isArray(relations)) relations = [relations];
         // check if every relation passed is valid
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const user = await repository.findOne(query.id, { relations });

         return user as User;
      }

      const user = await repository.findOne(query.id);

      return user as User;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async (relations?: string | string[]): Promise<User[]> => {
   try {
      repository = getRepository(User);
      const validRelations = ["images"];

      if(relations && relations.length >= 1) {
         // cast relations param to an array if string is provided
         if(!Array.isArray(relations)) relations = [relations];
         // check if every relation passed is valid
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const users = await repository.find({ relations });
         return users;
      }

      const users = await repository.find();

      return users;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);
      const updateResult = await repository.update(query, update);

      return updateResult as unknown as User;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);
      const result = await repository.delete(query);

      return result as unknown as User;
   } catch (err) {
      throw new Error(err.message);
   }
}