import request from "supertest";
import type { Server } from "http";

import app from "../src/app";

describe("environment check", () => {
   test("NODE_ENV should be set to 'test'", () => {
      expect(process.env.NODE_ENV).toEqual("test");
   });
});

describe("server", () => {
   let server: Server;

   beforeAll((done) => {
      server = app.listen();
      done();
   });

   afterAll((done) => {
      server.close();
      done();
   });

   it("should return a 404 error response for invalid endpoints", async (done) => {

      return request(server)
         .get("/test-endpoint")
         .expect(404)
         .expect((res) => {
            expect(res.ok).toBe(false);
            done();
         });
   });
});