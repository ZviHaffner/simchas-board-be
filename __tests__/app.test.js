const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const connection = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("/api/notARoute", () => {
  test("GET 404", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const allEndpoints = body.endpoints;
        for (key in allEndpoints) {
          expect(allEndpoints[key]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            reqBodyFormat: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
});

describe.only("/simchas/:simcha_type", () => {
  test("GET 200: Responds with all simchas for correct simcha type with host information added", () => {
    return request(app)
      .get("/api/simchas/shalom-zachor")
      .expect(200)
      .then(({ body }) => {
        expect(body.simchas.length).toBe(2);
        body.simchas.forEach((simcha) => {
          expect(simcha).toEqual({
            id: expect.any(Number),
            user_id: expect.any(Number),
            simcha_type: "shalom-zachor",
            title: expect.any(String),
            first_name: expect.any(String),
            surname: expect.any(String),
            tribe: expect.any(String),
          });
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent simcha type", () => {
    return request(app)
      .get("/api/simchas/not-a-simcha")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No simchas found for simcha_type: not-a-simcha");
      });
  });
});
