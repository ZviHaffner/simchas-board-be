const db = require("../db/connection");

exports.fetchSimchasByTypeWithHost = (simcha_type) => {
  return db
    .query(
    `
    SELECT 
      simchas.id, 
      simchas.user_id, 
      simchas.simcha_type, 
      sig_persons.title, 
      sig_persons.first_name, 
      sig_persons.surname, 
      sig_persons.tribe
    FROM 
      simchas
    JOIN 
      sig_persons ON simchas.id = sig_persons.simcha_id
                  AND sig_persons.person_type = 'host'
    WHERE
      simcha_type = $1;
    `,
      [simcha_type]
    )
    .then(({ rows }) => {
      console.log(rows);
      
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
