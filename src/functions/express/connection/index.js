if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

import Sequalize from "sequelize";
const ConnectionSequalize = new Sequalize(
  process.env.nameDatabase, //database
  process.env.userPostgres, //name user on the postgres
  process.env.passwordUserPostgres, // password user
  {
    host: process.env.host,
    dialect: process.env.dialect,
    logging: false, //not  output data
  }
);
console.log("DB IS CONNECTED TO AUTH POSTGRESQL");
export default ConnectionSequalize;
