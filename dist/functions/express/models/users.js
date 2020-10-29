"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _index = _interopRequireDefault(require("../connection/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ModelUser = _index["default"].define("users", {
  iduser: {
    type: _sequelize["default"].TEXT,
    primaryKey: true
  },
  email: _sequelize["default"].TEXT,
  password: _sequelize["default"].TEXT
}, {
  timestamps: false
});

var _default = ModelUser;
exports["default"] = _default;