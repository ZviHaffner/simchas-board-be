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

describe("/api/users", () => {
  test("GET 200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(3);
        body.users.forEach((simcha) => {
          expect(simcha).toMatchObject({
            id: expect.any(Number),
            firebase_uid: expect.any(String),
            first_name: expect.any(String),
            surname: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
          });
        });
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

describe("/api/simchas", () => {
  test("POST 201: Adds simcha and responds with the posted simcha", () => {
    const newSimcha = {
      user_id: 2,
      simcha_type: "wedding",
      notes: "Huge celebration!",
    };
    return request(app)
      .post("/api/simchas")
      .send(newSimcha)
      .expect(201)
      .then(({ body }) => {
        expect(body.simcha).toEqual({
          id: expect.any(Number),
          user_id: 2,
          simcha_type: "wedding",
          notes: "Huge celebration!",
        });
      });
  });
  test("POST 404: Responds with error when posted by a non existent user_id", () => {
    const newSimcha = {
      user_id: 99999999,
      simcha_type: "wedding",
      notes: "Huge celebration!",
    };
    return request(app)
      .post("/api/simchas")
      .send(newSimcha)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newSimcha = {
      user_id: 2,
      simcha_type: null,
      notes: "Huge celebration!",
    };
    return request(app)
      .post("/api/simchas")
      .send(newSimcha)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/sig-persons", () => {
  test("POST 201: Adds a significant person and responds with the posted person", () => {
    const newSigPerson = {
      simcha_id: 6,
      person_type: "relative",
      title: "Reb",
      first_name: "Benzy",
      surname: "Goldman",
      tribe: "yisrael",
      city_of_residence: "Manchester",
      country_of_residence: "UK",
      relationship_type: "grandfather",
      relation_of: "host",
    };
    return request(app)
      .post("/api/sig-persons")
      .send(newSigPerson)
      .expect(201)
      .then(({ body }) => {
        expect(body.sigPerson).toEqual({
          id: expect.any(Number),
          simcha_id: 6,
          person_type: "relative",
          title: "Reb",
          first_name: "Benzy",
          surname: "Goldman",
          tribe: "yisrael",
          city_of_residence: "Manchester",
          country_of_residence: "UK",
          relationship_type: "grandfather",
          relation_of: "host",
        });
      });
  });
  test("POST 404: Responds with error when posted by a non existent simcha_id", () => {
    const newSigPerson = {
      simcha_id: 99999999,
      person_type: "relative",
      title: "Reb",
      first_name: "Benzy",
      surname: "Goldman",
      tribe: "yisrael",
      city_of_residence: "Manchester",
      country_of_residence: "UK",
      relationship_type: "grandfather",
      relation_of: "host",
    };
    return request(app)
      .post("/api/sig-persons")
      .send(newSigPerson)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newSigPerson = {
      simcha_id: 6,
      person_type: "relative",
      title: "Reb",
      first_name: "Benzy",
      surname: "Goldman",
      tribe: "yisrael",
      city_of_residence: "Manchester",
      country_of_residence: "UK",
      relationship_type: "grandfather",
      relation_of: "host",
    };

    const cases = [
      { ...newSigPerson, simcha_id: "six" },
      { ...newSigPerson, person_type: "unrelated" },
      { ...newSigPerson, first_name: undefined },
    ];

    const requests = cases.map((body) =>
      request(app)
        .post("/api/sig-persons")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad Request");
        })
    );

    return Promise.all(requests);
  });
});

describe("/api/events", () => {
  test("POST 201: Adds an event and responds with the posted event", () => {
    const newEvent = {
      simcha_id: 8,
      title: "Tefillin Laying",
      date_and_time: "2025-01-15T07:15:00Z",
      end_time: "2025-01-15T08:15:00Z",
      location_name: "The Roumainishe Shul",
      address_first_line: "2 Vine Street",
      area: "Salford",
      city_of_event: "Manchester",
      country_of_event: "UK",
      men_only: true,
    };
    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(201)
      .then(({ body }) => {
        expect(body.event).toMatchObject({
          id: expect.any(Number),
          simcha_id: 8,
          title: "Tefillin Laying",
          location_name: "The Roumainishe Shul",
          address_first_line: "2 Vine Street",
          area: "Salford",
          city_of_event: "Manchester",
          country_of_event: "UK",
          men_only: true,
        });
        expect(body.event.date_and_time).toBeDateString();
        expect(body.event.end_time).toBeDateString();
      });
  });
  test("POST 404: Responds with error when posted by a non existent simcha_id", () => {
    const newEvent = {
      simcha_id: 99999999,
      title: "Tefillin Laying",
      date_and_time: "2025-01-15T07:15:00Z",
      end_time: "2025-01-15T08:15:00Z",
      location_name: "The Roumainishe Shul",
      address_first_line: "2 Vine Street",
      area: "Salford",
      city_of_event: "Manchester",
      country_of_event: "UK",
      men_only: true,
    };
    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newEvent = {
      simcha_id: 8,
      title: "Tefillin Laying",
      date_and_time: "2025-01-15T07:15:00Z",
      end_time: "2025-01-15T08:15:00Z",
      location_name: "The Roumainishe Shul",
      address_first_line: "2 Vine Street",
      area: "Salford",
      city_of_event: "Manchester",
      country_of_event: "UK",
      men_only: true,
    };

    const cases = [
      { ...newEvent, simcha_id: "eight" },
      { ...newEvent, men_only: "maybe" },
      { ...newEvent, location_name: undefined },
    ];

    const requests = cases.map((body) =>
      request(app)
        .post("/api/events")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad Request");
        })
    );

    return Promise.all(requests);
  });
});

describe("/api/users", () => {
  test("POST 201: Adds a user and responds with the posted user", () => {
    const newUser = {
      firebase_uid: "uid_99",
      first_name: "Chaim",
      surname: "Harris",
      email: "chaimharris@email.com",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          id: expect.any(Number),
          firebase_uid: "uid_99",
          first_name: "Chaim",
          surname: "Harris",
          email: "chaimharris@email.com",
        });
        expect(new Date(body.user.created_at)).toBeDate();
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newUser = {
      firebase_uid: "uid_99",
      first_name: "Chaim",
      surname: "Harris",
      email: null,
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/users/:id", () => {
  test("GET 200: Responds with specified user", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          id: 1,
          firebase_uid: "uid_1",
          first_name: "Akiva",
          surname: "Babad",
          email: "akiva.babad@example.com",
        });
        expect(new Date(user.created_at)).toBeDate();
      });
  });
  test("GET 404: Responds with error when passed a non-existent username", () => {
    return request(app)
      .get("/api/users/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No user found for ID: 99999999");
      });
  });
  test("GET 400: Responds with error when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/users/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe.only("/api/users/:id", () => {
  test("PATCH 200: Responds with updated version of the correct user", () => {
    const update = { column: "first_name", value: "Joseph" };
    return request(app)
      .patch("/api/users/3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedUser).toMatchObject({
          id: 3,
          firebase_uid: "uid_3",
          first_name: "Joseph",
          surname: "Dubiner",
          email: "yos.dubiner@example.com",
        });
        expect(new Date(body.updatedUser.created_at)).toBeDate();
      });
  });
  test("PATCH 400: Responds with error when an empty object is posted", () => {
    const update = {};
    return request(app)
      .patch("/api/users/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const update = { column: "first_name" };
    return request(app)
      .patch("/api/users/3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 404: Responds with error when passed a non-existent ID", () => {
    const update = { column: "first_name", value: "Joseph" };
    return request(app)
      .patch("/api/users/9999999")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No user found for id: 9999999");
      });
  });
  test("PATCH 400: Responds with error when passed an ID that is not a number", () => {
    const update = { column: "first_name", value: "Joseph" };
    return request(app)
      .patch("/api/users/NaN")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/simchas/:id/details", () => {
  test("GET 200: Responds with correct simcha", () => {
    return request(app)
      .get("/api/simchas/10/details")
      .expect(200)
      .then(({ body }) => {
        const simcha = body.simcha;

        expect(simcha).toMatchObject({
          id: 10,
          user_id: 1,
          simcha_type: "aufruf",
          notes: null,
        });
      });
  });
  test("GET 200: Adds on all significant persons information", () => {
    return request(app)
      .get("/api/simchas/10/details")
      .expect(200)
      .then(({ body }) => {
        const simcha = body.simcha;

        expect(Array.isArray(simcha.sig_persons)).toBe(true);
        expect(simcha.sig_persons).toHaveLength(3);
        simcha.sig_persons.forEach((sig_person) => {
          expect(sig_person).toMatchObject({
            id: expect.any(Number),
            simcha_id: simcha.id,
            title: expect.any(String),
            first_name: expect.any(String),
            surname: expect.any(String),
            tribe: expect.any(String),
            city_of_residence: expect.any(String),
            country_of_residence: expect.any(String),
            relationship_type: expect.toBeOneOf([expect.any(String), null]),
            relation_of: expect.toBeOneOf([expect.any(String), null]),
          });
        });
      });
  });
  test("GET 200: Adds on all events information", () => {
    return request(app)
      .get("/api/simchas/10/details")
      .expect(200)
      .then(({ body }) => {
        const simcha = body.simcha;

        expect(Array.isArray(simcha.events)).toBe(true);
        expect(simcha.events).toHaveLength(2);
        simcha.events.forEach((event) => {
          expect(event).toMatchObject({
            id: expect.any(Number),
            simcha_id: simcha.id,
            title: expect.any(String),
            date_and_time: expect.any(String),
            end_time: expect.toBeOneOf([expect.any(String), null]),
            location_name: expect.any(String),
            address_first_line: expect.any(String),
            area: expect.any(String),
            city_of_event: expect.any(String),
            country_of_event: expect.any(String),
            men_only: expect.any(Boolean),
          });
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent ID", () => {
    return request(app)
      .get("/api/simchas/99999999/details")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No simcha found for id: 99999999");
      });
  });
  test("GET 400: Responds with error when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/simchas/NaN/details")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/simchas/types/:simcha_type", () => {
  test("GET 200: Responds with all simchas for correct simcha type", () => {
    return request(app)
      .get("/api/simchas/types/bris?start_date=1971-01-01&end_date=2100-01-01")
      .expect(200)
      .then(({ body }) => {
        expect(body.simchas).toHaveLength(2);
        body.simchas.forEach((simcha) => {
          expect(simcha).toMatchObject({
            id: expect.any(Number),
            user_id: expect.any(Number),
            simcha_type: "bris",
          });
        });
      });
  });
  test("GET 200: Adds host information to response", () => {
    return request(app)
      .get("/api/simchas/types/bris?start_date=1971-01-01&end_date=2100-01-01")
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
      .get("/api/simchas/types/bris?start_date=1971-01-01&end_date=2100-01-01")
      .expect(200)
      .then(({ body }) => {
        body.simchas.forEach((simcha) => {
          expect(simcha).toMatchObject({
            date_and_time: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Responds with correct data between a specified date range", () => {
    return request(app)
      .get(
        "/api/simchas/types/bar-mitzvah?start_date=2025-01-15&end_date=2025-01-22"
      )
      .expect(200)
      .then(({ body }) => {
        expect(body.simchas).toHaveLength(1);
        body.simchas.forEach((simcha) => {
          expect(simcha).toMatchObject({
            id: 8,
            user_id: 2,
            simcha_type: "bar-mitzvah",
            title: "HaBachur",
            first_name: "Moshe",
            surname: "Goldberg",
            tribe: "levi",
            date_and_time: "2025-01-18T10:15:00.000Z",
          });
          expect(new Date(simcha.date_and_time)).toBeBetween(
            new Date("2025-01-15"),
            new Date("2025-01-22")
          );
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
