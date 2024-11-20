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
