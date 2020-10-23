"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

var ConnectionSequalize = new _sequelize["default"](process.env.nameDatabase, //database
process.env.userPostgres, //name user on the postgres
process.env.passwordUserPostgres, // password user
{
  host: process.env.host,
  dialect: process.env.dialect,
  logging: false //not  output data

});
console.log("DB IS CONNECTED TO AUTH POSTGRESQL");
var _default = ConnectionSequalize;
exports["default"] = _default;