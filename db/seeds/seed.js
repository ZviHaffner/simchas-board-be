const format = require("pg-format");
const db = require("../connection");

const seed = ({ eventsData, sigPersonsData, simchasData, usersData }) => {
  return db
    .query(`DROP TABLE IF EXISTS events CASCADE;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS sig_persons CASCADE;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS simchas CASCADE;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users CASCADE;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL, -- Firebase User ID
        first_name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, -- Email address for communication
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE simchas (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        simcha_type VARCHAR(255) NOT NULL,
        notes TEXT
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE sig_persons (
        id SERIAL PRIMARY KEY,
        simcha_id INT NOT NULL REFERENCES simchas(id) ON DELETE CASCADE,
        person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('host', 'bride', 'relative')),
        title VARCHAR(50),
        first_name VARCHAR(100),
        surname VARCHAR(100) NOT NULL,
        tribe VARCHAR(10) DEFAULT 'yisrael' CHECK (tribe IN ('cohen', 'levi', 'yisrael')),
        city_of_residence VARCHAR(50),
        country_of_residence VARCHAR(50),
        relationship_type VARCHAR(50),
        relation_of VARCHAR(10) CHECK (relation_of IN ('host', 'bride')),
        CHECK (
            (person_type = 'kallah') OR (first_name IS NOT NULL)
        ),
        CHECK (
            (person_type != 'relative') OR
            (relationship_type IS NOT NULL AND relation_of IS NOT NULL)
        )
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        simcha_id INT NOT NULL REFERENCES simchas(id) ON DELETE CASCADE,
        title VARCHAR(255),
        date_and_time TIMESTAMP,
        end_time TIMESTAMP,
        location_name VARCHAR(255) NOT NULL,
        address_first_line VARCHAR(255),
        area VARCHAR(255),
        city_of_event VARCHAR(50),
        country_of_event VARCHAR(50),
        men_only BOOLEAN DEFAULT FALSE
      );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (firebase_uid, first_name, surname, email) VALUES %L RETURNING *;",
        usersData.map(
          ({ firebase_uid, first_name, surname, email, created_at }) => [
            firebase_uid,
            first_name,
            surname,
            email,
          ]
        )
      );

      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertSimchasQueryStr = format(
        "INSERT INTO simchas (user_id, simcha_type, notes) VALUES %L RETURNING *;",
        simchasData.map(({ user_id, simcha_type, notes }) => [
          user_id,
          simcha_type,
          notes,
        ])
      );

      return db.query(insertSimchasQueryStr);
    })
    .then(() => {
      const insertSigPersonsQueryStr = format(
        "INSERT INTO sig_persons (simcha_id, person_type, title, first_name, surname, tribe, city_of_residence, country_of_residence, relationship_type, relation_of) VALUES %L RETURNING *;",
        sigPersonsData.map(
          ({
            simcha_id,
            person_type,
            title,
            first_name,
            surname,
            tribe,
            city_of_residence,
            country_of_residence,
            relationship_type,
            relation_of,
          }) => [
            simcha_id,
            person_type,
            title,
            first_name,
            surname,
            tribe,
            city_of_residence,
            country_of_residence,
            relationship_type,
            relation_of,
          ]
        )
      );

      return db.query(insertSigPersonsQueryStr);
    })
    .then(() => {
      const insertEventsQueryStr = format(
        "INSERT INTO events (simcha_id, title, date_and_time, end_time, location_name, address_first_line, area, city_of_event, country_of_event, men_only) VALUES %L RETURNING *;",
        eventsData.map(
          ({
            simcha_id,
            title,
            date_and_time,
            end_time,
            location_name,
            address_first_line,
            area,
            city_of_event,
            country_of_event,
            men_only,
          }) => [
            simcha_id,
            title,
            date_and_time,
            end_time,
            location_name,
            address_first_line,
            area,
            city_of_event,
            country_of_event,
            men_only,
          ]
        )
      );

      return db.query(insertEventsQueryStr);
    });
};

module.exports = seed;
