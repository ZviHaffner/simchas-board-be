const db = require("../db/connection");

exports.fetchAllSimchas = () => {
  return db.query("SELECT * FROM simchas");
};

exports.fetchCompleteSimchaById = (id) => {
  return db
    .query(
      `
        SELECT 
            simchas.*, 
            JSON_AGG(DISTINCT sig_persons.*) AS sig_persons, 
            JSON_AGG(DISTINCT events.*) AS events
        FROM 
            simchas
        JOIN 
            sig_persons ON simchas.id = sig_persons.simcha_id
        JOIN 
            events ON simchas.id = events.simcha_id
        WHERE
            simchas.id = $1
        GROUP BY
            simchas.id;
    `,
      [id]
    )
    .then(({ rows }) => {
      const simcha = rows[0];
      if (!simcha) {
        return Promise.reject({
          status: 404,
          msg: `No simcha found for id: ${id}`,
        });
      }
      return simcha;
    });
};

exports.fetchSimchasByTypeWithHostAndDate = (
  simcha_type,
  start_date,
  end_date
) => {
  return db
    .query(
      `
        SELECT 
            DISTINCT ON (simchas.id)
            simchas.id, 
            simchas.user_id, 
            simchas.simcha_type, 
            sig_persons.title, 
            sig_persons.first_name, 
            sig_persons.surname, 
            sig_persons.tribe,
            events.date_and_time
        FROM 
            simchas
        JOIN 
            sig_persons ON simchas.id = sig_persons.simcha_id
                        AND sig_persons.person_type = 'host'
        JOIN 
            events ON simchas.id = events.simcha_id
                    AND events.date_and_time BETWEEN $2 AND $3
        WHERE
            simchas.simcha_type = $1;
    `,
      [simcha_type, start_date, end_date]
    )
    .then(({ rows }) => {
      const simchas = rows;
      if (!simchas.length) {
        return Promise.reject({
          status: 404,
          msg: `No simchas found for simcha_type: ${simcha_type}`,
        });
      }
      return simchas;
    });
};

exports.insertSimcha = ({ user_id, simcha_type, notes }) => {
  return db
    .query(
      "INSERT INTO simchas (user_id, simcha_type, notes) VALUES ($1, $2, $3) RETURNING *;",
      [user_id, simcha_type, notes]
    )
    .then(({ rows }) => rows[0]);
};

exports.updateSimchaById = (id, column, value) => {
  let queryString;

  const validColumns = ["simcha_type", "notes"];

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
      UPDATE simchas
      SET
        ${column} = $2
      WHERE id = $1
      RETURNING *;`;
  }

  return db.query(queryString, [id, value]).then(({ rows }) => {
    const updatedSimcha = rows[0];
    if (!updatedSimcha) {
      return Promise.reject({
        status: 404,
        msg: `No simcha found for id: ${id}`,
      });
    }
    return updatedSimcha;
  });
};

exports.deleteSimchaByID = (id) => {
  return db
    .query(
      `
      DELETE FROM simchas
      WHERE id = $1
      RETURNING *
    `,
      [id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No simcha found for ID: ${id}`,
        });
      }
      return result;
    });
};
