import request from "supertest";
import type { Server } from "http";
import { getRepository } from "typeorm";
import type { Connection, Repository } from "typeorm";

import app from "../src/app";
import User from "~entity/user.entity";
import Image from "~entity/image.entity";
import connectDB from "~config/db.config";
import { Permissions } from "~declarations/enums";

const BASE_URL = "/api/v1/images";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwNDg2MWZiLTAyNDctNDE5OS1iMTE2LTQxYTk0NGUwMjgzZSIsImVtYWlsIjoidGVkZEBoZXkuY29tIiwiaWF0IjoxNjEwNzgwNTc1LCJleHAiOjE2MTEzODUzNzV9.DAbKSNnkxmqnbprCeOCnAEnAiXeQZCGHC01-ViRNye0";
const TEST_DATA = {
   users: [
      {
         id: "13daddf6-cff8-4290-91a3-535620a2e4c6",
         firstname: "Sander",
         lastname: "Berge",
         email: "sandy@hey.com",
         password: "password"
      },
      {
         id: "304861fb-0247-4199-b116-41a944e0283e",
         firstname: "Tedd",
         lastname: "Dalton",
         email: "tedd@hey.com",
         password: "password"
      }
   ],
   images: [
      {
         id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
         url: "https://image-repository-s3-bucket.s3.us-east-2.amazonaws.com/images/Screenshot%20from%202020-08-14%2012-31-49.png-JDVzxuw3",
         permission: Permissions.PUBLIC,
         key: "images/Screenshot from 2020-08-14 12-31-49.png-JDVzxuw3",
         owner: "13daddf6-cff8-4290-91a3-535620a2e4c6"
      },
      {
         id: "0e6c8b1b-50b7-403f-b01e-47961743dc59",
         url: "https://image-repository-s3-bucket.s3.us-east-2.amazonaws.com/images/Screenshot%20from%202020-08-14%2012-31-49.png-JDVzxuw3",
         permission: Permissions.PRIVATE,
         key: "images/Screenshot from 2020-08-14 12-31-49.png-JDVzxuw3",
         owner: "13daddf6-cff8-4290-91a3-535620a2e4c6"
      }
   ]
}

describe("images", () => {
   let server: Server;
   let connection: Connection
   let userRepository: Repository<User>;
   let imageRepository: Repository<Image>;

   beforeAll(async (done) => {
      connection = <Connection>await connectDB();
      server = app.listen();
      userRepository = getRepository(User);
      imageRepository = getRepository(Image);

      for await(const user of TEST_DATA.users) {
         const instance = userRepository.create(user);
         await userRepository.save(instance);
      }

      for await(const image of TEST_DATA.images) {
         const instance = imageRepository.create(image as unknown as User);
         await imageRepository.save(instance);
      }

      done();
   });

   afterAll(async (done) => {
      server.close();

      // cleanup
      await userRepository.delete({});
      await imageRepository.delete({});

      await connection.close();
      done();
   });

   it("should return a 403 forbidden error", async (done) => {

      return request(server)
         .delete(`${BASE_URL}/0e6c8b1b-50b7-403f-b01e-47961743dc58`)
         .set("Authorization", `Bearer ${TOKEN}`)
         .expect(403)
         .expect((res) => {
            expect(res.ok).toBe(false);
            done();
         });
   });
});