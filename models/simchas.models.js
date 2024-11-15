const db = require("../db/connection");

exports.fetchAllSimchas = () => {
  return db.query("SELECT * FROM simchas");
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
