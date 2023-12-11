const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("uts_todolist", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
