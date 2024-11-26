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
