const db = require("../db/connection");

exports.insertSigPerson = ({
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
}) => {
  return db
    .query(
      `INSERT INTO sig_persons (
          simcha_id,
          person_type,
          title,
          first_name,
          surname,
          tribe,
          city_of_residence,
          country_of_residence,
          relationship_type,
          relation_of
      ) VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *;`,
      [
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
    .then(({ rows }) => rows[0]);
};
