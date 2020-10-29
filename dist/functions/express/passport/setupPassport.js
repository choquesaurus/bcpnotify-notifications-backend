"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = require("passport-local");

var _users = _interopRequireDefault(require("../models/users"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//import { database } from "../../../datalayer/backing/firebase/index";
_passport["default"].serializeUser(function (user, done) {
  done(null, user.iduser);
}); // passport.deserializeUser(async (iduser, done) => {
//   const findUser = await ModelUser.findOne({
//     attributes: ["iduser", "nrocuenta"],
//     where: { iduser },
//   });
//   done(null, findUser == null ? {} : findUser.dataValues);
// });


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(iduser, done) {
    var findUser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _users["default"].findOne({
              attributes: ["iduser" //, "nrocuenta"
              ],
              where: {
                iduser: iduser
              }
            });

          case 2:
            findUser = _context.sent;
            done(null, findUser == null ? {} : findUser);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

_passport["default"].use(new _passportLocal.Strategy({
  usernameField: "email"
}, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(username, password, done) {
    var searchuser;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _users["default"].findOne({
              attributes: ["iduser", "email", "password"],
              where: {
                email: username
              }
            });

          case 2:
            searchuser = _context2.sent;

            if (!(searchuser != null && searchuser.dataValues.hasOwnProperty("email"))) {
              _context2.next = 15;
              break;
            }

            if (!_bcryptjs["default"].compareSync(password, searchuser.dataValues.password)) {
              _context2.next = 8;
              break;
            }

            console.log("1", "1 Contraseña correcto o credenciales correctas");
            delete searchuser.dataValues.password;
            return _context2.abrupt("return", done(null, searchuser.dataValues));

          case 8:
            if (!(_bcryptjs["default"].compareSync(password, searchuser.dataValues.password) == false)) {
              _context2.next = 12;
              break;
            }

            console.log("2", "Contraseña correcto ");
            delete searchuser.dataValues.password;
            return _context2.abrupt("return", done(null, false));

          case 12:
            console.log("3", "3 Usuario correcto o credenciales correctas");
            delete searchuser.dataValues.password;
            return _context2.abrupt("return", done(null, searchuser.dataValues));

          case 15:
            console.log("4", "error credenciales incorrectas");
            return _context2.abrupt("return", done(null, false));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()));