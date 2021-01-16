import request from "supertest";
import type { Server } from "http";
import type { Connection } from "typeorm";

import app from "../src/app";
import * as userRepository from "~repository/user.repository";
import * as utils from "~utils/index";
import User from "~entity/user.entity";
import connectDB from "~config/db.config";

const BASE_URL = "/api/v1/auth";

describe("auth", () => {
   let server: Server;
   let connection: Connection

   beforeAll(async (done) => {
      connection = <Connection>await connectDB();
      server = app.listen();
      done();
   });

   afterAll(async (done) => {
      server.close();
      await connection.close();
      done();
   });

   it("should return an authentication error if missing/invalid auth header", async (done) => {

      return request(server)
         .delete("/api/v1/images/0e6c8b1b-50b7-403f-b01e-47961743dc58")
         .expect(401)
         .expect((res) => {
            expect(res.ok).toBe(false);
            done();
         });
   });

   it("should login user and return profile with auth token", async (done) => {
      const payload = {
         email: "sandy@hey.com",
         password: "password"
      }

      const hash = await utils.hashPassword(payload.password);

      const expectedResponse = {
         id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
         email: payload.email,
         password: hash
      }

      const mockFindOne = jest.spyOn(userRepository, "findOne").mockImplementation(() => {
         return Promise.resolve(expectedResponse as User);
      });

      return request(server)
         .post(`${BASE_URL}/login`)
         .send(payload)
         .expect(200)
         .expect((res) => {
            expect(mockFindOne).toHaveBeenCalled();
            expect(res.ok).toBe(true);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("user");
            expect(res.body.data).toHaveProperty("token");
            done();
         });
   });

   it("should return an unauthorized error response if wrong password is provided", async (done) => {
      const payload = {
         email: "sandy@hey.com",
         password: "password"
      }

      const hash = await utils.hashPassword("password123");

      const expectedResponse = {
         id: "0e6c8b1b-50b7-403f-b01e-47961743dc58",
         email: payload.email,
         password: hash
      }

      // create a mock implementaion of <repository.findOne>
      const mockFindOne = jest.spyOn(userRepository, "findOne").mockImplementation(() => {
         return Promise.resolve(expectedResponse as User);
      });

      return request(server)
         .post(`${BASE_URL}/login`)
         .send(payload)
         .expect(401)
         .expect((res) => {
            expect(mockFindOne).toHaveBeenCalled();
            expect(res.ok).toBe(false);
            expect(res.body).toMatchObject({ok: false, message: "invalid credentials"});
            done();
         });
   });

   it("should create user and return profile with auth token", async (done) => {
      const payload = {
         firstname: "Sander",
         lastname: "Berge",
         email: "sander.b@hey.com",
         password: "password"
      }

      const { password, ...createdUser } = payload;

      const mockGenerateAuthToken = jest.spyOn(utils, "generateAuthToken");
      const mockCreate = jest.spyOn(userRepository, "create").mockImplementation(() => {
         return Promise.resolve({ ...createdUser, id: "0e6c8b1b-50b7-403f-b01e-47961743dc58" } as User);
      });

      return request(server)
         .post(`${BASE_URL}/signup`)
         .send(payload)
         .expect(200)
         .expect((res) => {
            expect(mockGenerateAuthToken).toHaveBeenCalledWith("7d", { id: "0e6c8b1b-50b7-403f-b01e-47961743dc58", email: createdUser.email });
            expect(mockCreate).toHaveBeenCalled();
            expect(res.ok).toBe(true);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("user");
            expect(res.body.data).toHaveProperty("token");
            done();
         });
   });
});