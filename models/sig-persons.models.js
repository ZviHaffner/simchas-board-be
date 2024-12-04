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

exports.updateSigPersonById = (id, column, value) => {
  let queryString;

  const validColumns = [
    "title",
    "first_name",
    "surname",
    "tribe",
    "city_of_residence",
    "country_of_residence",
    "relationship_type",
    "relation_of",
  ];

  if (!id || !column || !value) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  } else if (!validColumns.includes(column)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Column",
    });
  } else {
    queryString = `
      UPDATE sig_persons
      SET
        ${column} = $2
      WHERE id = $1
      RETURNING *;`;
  }

  return db.query(queryString, [id, value]).then(({ rows }) => {
    const updatedSigPerson = rows[0];
    if (!updatedSigPerson) {
      return Promise.reject({
        status: 404,
        msg: `No person found for id: ${id}`,
      });
    }
    return updatedSigPerson;
  });
};
