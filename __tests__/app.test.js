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

describe("/api/simchas", () => {
  test("GET 200: Responds with all simchas", () => {
    return request(app)
      .get("/api/simchas")
      .expect(200)
      .then(({ body }) => {
        expect(body.simchas.length).toBe(14);
        body.simchas.forEach((simcha) => {
          expect(simcha).toMatchObject({
            id: expect.any(Number),
            user_id: expect.any(Number),
            simcha_type: expect.any(String),
          });
          expect(
            typeof simcha.notes === "string" || simcha.notes === null
          ).toBe(true);
        });
      });
  });
});

describe("/api/simchas/types/:simcha_type", () => {
  const simchaTypes = ["shalom-zachor", "bris"];

  simchaTypes.forEach((simchaType) => {
    test(`GET 200: Responds with all simchas for correct simcha type (${simchaType})`, () => {
      return request(app)
        .get(
          `/api/simchas/types/${simchaType}?start_date=1971-01-01&end_date=2100-01-01`
        )
        .expect(200)
        .then(({ body }) => {
          expect(body.simchas.length).toBe(2);
          body.simchas.forEach((simcha) => {
            expect(simcha).toMatchObject({
              id: expect.any(Number),
              user_id: expect.any(Number),
              simcha_type: simchaType,
            });
          });
        });
    });
    test("GET 200: Adds host information to response", () => {
      return request(app)
        .get(
          `/api/simchas/types/${simchaType}?start_date=1971-01-01&end_date=2100-01-01`
        )
        .expect(200)
        .then(({ body }) => {
          body.simchas.forEach((simcha) => {
            expect(simcha).toMatchObject({
              title: expect.any(String),
              first_name: expect.any(String),
              surname: expect.any(String),
              tribe: expect.any(String),
            });
          });
        });
    });
    test("GET 200: Adds date and time to response", () => {
      return request(app)
        .get(
          `/api/simchas/types/${simchaType}?start_date=1971-01-01&end_date=2100-01-01`
        )
        .expect(200)
        .then(({ body }) => {
          body.simchas.forEach((simcha) => {
            expect(simcha).toMatchObject({
              date_and_time: expect.any(String),
            });
          });
        });
    });
  });
  test("GET 200: Responds with correct data between a specified date range", () => {
    return request(app)
      .get("/api/simchas/types/bar-mitzvah?start_date=2025-01-15&end_date=2025-01-22")
      .expect(200)
      .then(({ body }) => {
        expect(body.simchas.length).toBe(1);
        body.simchas.forEach((simcha) => {
          expect(simcha).toMatchObject({
            id: 8,
            user_id: expect.any(Number),
            simcha_type: "bar-mitzvah",
            title: expect.any(String),
            first_name: expect.any(String),
            surname: expect.any(String),
            tribe: expect.any(String),
            date_and_time: expect.any(String),
          });
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent simcha type", () => {
    return request(app)
      .get(
        "/api/simchas/types/not-a-simcha?start_date=1971-01-01&end_date=2100-01-01"
      )
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "No simchas found for simcha_type: not-a-simcha"
        );
      });
  });
  test("GET 400: Responds with error when passed a non valid date query", () => {
    return request(app)
      .get(
        "/api/simchas/types/bar-mitzvah?start_date=SQLInjection&end_date=SQLInjection"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});
