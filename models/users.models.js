const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query("SELECT * FROM users");
};

exports.fetchUserById = (id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for ID: ${id}`,
        });
      }
      return user;
    });
};

exports.insertUser = ({ firebase_uid, first_name, surname, email }) => {
  return db
    .query(
      `INSERT INTO users (
          firebase_uid,
          first_name,
          surname,
          email
      ) VALUES 
          ($1, $2, $3, $4) 
      RETURNING *;`,
      [firebase_uid, first_name, surname, email]
    )
    .then(({ rows }) => rows[0]);
};
