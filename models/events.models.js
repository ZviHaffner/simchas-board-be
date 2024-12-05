const db = require("../db/connection");

exports.insertEvent = ({
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
}) => {
  return db
    .query(
      `INSERT INTO events (
          simcha_id,
          title,
          date_and_time,
          end_time,
          location_name,
          address_first_line,
          area,
          city_of_event,
          country_of_event,
          men_only
      ) VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *;`,
      [
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
    .then(({ rows }) => rows[0]);
};

exports.updateEventById = (id, column, value) => {
  let queryString;

  const validColumns = [
    "title",
    "location_name",
    "address_first_line",
    "area",
    "city_of_event",
    "country_of_event",
    "men_only",
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
      UPDATE events
      SET
        ${column} = $2
      WHERE id = $1
      RETURNING *;`;
  }

  return db.query(queryString, [id, value]).then(({ rows }) => {
    const updatedEvent = rows[0];
    if (!updatedEvent) {
      return Promise.reject({
        status: 404,
        msg: `No event found for id: ${id}`,
      });
    }
    return updatedEvent;
  });
};

exports.deleteEventByID = (id) => {
  return db
    .query(`
      DELETE FROM events
      WHERE id = $1
      RETURNING *
    `,
      [id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No event found for ID: ${id}`,
        });
      }
      return result;
    });
};