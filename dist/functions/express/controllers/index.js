"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVerified = isVerified;
exports.validate_create_new_user = void 0;

var _users = _interopRequireDefault(require("../models/users"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _uid = _interopRequireDefault(require("uid"));

var _index = require("../../../datalayer/backing/firebase/index");

var _crypto = _interopRequireDefault(require("crypto"));

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index2 = require("../../../datalayer/backing/sendgrid/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

function isVerified(_x, _x2, _x3) {
  return _isVerified.apply(this, arguments);
}

function _isVerified() {
  _isVerified = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var email, result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // if (!(results.docs[0] && "details_user" in results.docs[0].data())) {
            //   throw new Error("No existe el ususarios");
            // }
            email = req.body.email;
            _context4.next = 3;
            return _index.database.collection("users").where("details_user.email", "==", email).where("validUser.isVerified", "==", true).get();

          case 3:
            result = _context4.sent;

            if (result.docs[0] && "details_user" in result.docs[0].data()) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.redirect(process.env.failureRedirect));

          case 6:
            return _context4.abrupt("return", next());

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _isVerified.apply(this, arguments);
}

var validate_create_new_user = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var usercreated, _req$body, password, rest, searchuser, hash_password, cryptoTokenValidateUser, _yield$IngestUserToFi, FillToFirebaseUser, urlbase;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            usercreated = {}; //const { nrocuenta, password } = req.body;

            _req$body = req.body, password = _req$body.password, rest = _objectWithoutProperties(_req$body, ["password"]); //Buscar en la tabla el siguiente numero de cuenta :) :)

            _context.next = 5;
            return _users["default"].findOne({
              where: {
                email: rest.email
              }
            });

          case 5:
            searchuser = _context.sent;
            //VALIDAR PARAMETROS
            validateParams(rest); //Validar si existe  o no

            if (!(searchuser === null)) {
              _context.next = 24;
              break;
            }

            //el usuario no existe --> se crea un nuevo usuario
            hash_password = _bcryptjs["default"].hashSync(password, 10);
            _context.next = 11;
            return _users["default"].create({
              iduser: "".concat((0, _uid["default"])(32), "-").concat(new Date().toLocaleTimeString()),
              email: rest.email,
              password: hash_password // telephone,

            }, {
              fields: ["iduser", "email", "password" // "telephone"
              ]
            });

          case 11:
            usercreated = _context.sent;
            delete usercreated._previousDataValues.password;
            delete usercreated.dataValues.password; //Poblar Informacion en Firebase --> Collection (users)

            console.log("creado", usercreated.dataValues.iduser); //CREACION DE TOKEN DE USUARIO PARA CREAR LINK DE VALIDACION
            //Y ACTIVACION
            //const cryptoTokenValidateUser = crypto.randomBytes(20).toString("HEX");

            cryptoTokenValidateUser = _jsonwebtoken["default"].sign({
              iduser: usercreated.dataValues.iduser
            }, process.env.SECRET_JWT_CRYPTOTOKENVALIDATEUSER, {
              expiresIn: "1d"
            });
            _context.next = 18;
            return IngestUserToFirebaseUser(_objectSpread(_objectSpread({}, rest), {}, {
              iduser: usercreated.dataValues.iduser,
              cryptoTokenValidateUser: cryptoTokenValidateUser
            }));

          case 18:
            _yield$IngestUserToFi = _context.sent;
            FillToFirebaseUser = _yield$IngestUserToFi.FillToFirebaseUser;
            // AGREGAR API KEY => SEND GRID MAIL
            // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            //OBTENER LINK DE LA APLICACION BASE
            urlbase = "".concat(req.protocol, "://").concat(req.headers.host);
            _context.next = 23;
            return VerifyAccountEmailAddress(rest.email, cryptoTokenValidateUser, urlbase);

          case 23:
            return _context.abrupt("return", res.send({
              //message: `El numero de cuenta ${nrocuenta} se creo correctamente`,
              message: "Se envio un link de activacion  a tu correo ".concat(rest.email),
              status: 1,
              the_user_was_created: true,
              user_information_created: {
                iduser: usercreated.dataValues.iduser,
                email: usercreated.dataValues.email // telephone: usercreated.dataValues.telephone,

              },
              FillToFirebaseUser: FillToFirebaseUser
            }));

          case 24:
            if (!("email" in searchuser && searchuser !== null)) {
              _context.next = 26;
              break;
            }

            throw Error("El correo ".concat(rest.email, " ya esta asociado u creado"));

          case 26:
            // const users = await ModelUser.findAll();
            res.send({
              message: "default"
            });
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.send({
              message: _context.t0.message,
              status: 0,
              the_user_was_created: false,
              FillToFirebaseUser: false
            }));

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 29]]);
  }));

  return function validate_create_new_user(_x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.validate_create_new_user = validate_create_new_user;

var validateParams = function validateParams(_ref2) {
  var nrocuenta = _ref2.nrocuenta;

  if (nrocuenta.length > 14) {
    throw new Error("nro de cuenta excede los 14 digitos");
  }
};

var VerifyAccountEmailAddress = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email, cryptoToken, urlbase) {
    var msg;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _mail["default"].setApiKey(process.env.SENDGRID_API_KEY);

            msg = {
              to: email,
              // Change to your recipient
              from: "Activacion BCP <".concat(process.env.EMAIL_BCPNOTIFY_SENDGRID_SENDER_ACTIVATION, ">"),
              //from: "bcpnotify@choquesaurus.com", // Change to your verified sender
              subject: "Necesitas activar tu cuenta",
              //text: msj,
              //html: TemplateHTMLActiveLinkEmail(urlbase, cryptoToken),
              html: "<a href='https://choquesaurus.com' target='_blank'>activar link</a>"
            };
            _context2.prev = 2;
            _context2.next = 5;
            return _mail["default"].send(msg);

          case 5:
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](2);
            throw _context2.t0;

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 7]]);
  }));

  return function VerifyAccountEmailAddress(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

var IngestUserToFirebaseUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4) {
    var nrocuenta, _ref4$photoURL, photoURL, email, name, last_name, age, iduser, cryptoTokenValidateUser;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            nrocuenta = _ref4.nrocuenta, _ref4$photoURL = _ref4.photoURL, photoURL = _ref4$photoURL === void 0 ? "https://cdn3.f-cdn.com/contestentries/1269942/15600440/5a991c82be987_thumb900.jpg" : _ref4$photoURL, email = _ref4.email, name = _ref4.name, last_name = _ref4.last_name, age = _ref4.age, iduser = _ref4.iduser, cryptoTokenValidateUser = _ref4.cryptoTokenValidateUser;
            _context3.prev = 1;
            _context3.next = 4;
            return _index.database.collection("users").doc(iduser).set( //.add(
            {
              created: true,
              //uid: user.uid,
              details_create: {
                creationTime: new Date().toDateString(),
                //metadata.creationTime
                device: ""
              },
              details_user: {
                name: name,
                last_name: last_name,
                photoURL: photoURL,
                //displayName: user.displayName,
                email: email,
                nrocuenta: nrocuenta,
                age: age
              },
              validUser: {
                isVerified: false,
                token: cryptoTokenValidateUser
              },
              token: "" //tokens: [],

            });

          case 4:
            _context3.next = 6;
            return _index.database.collection("users").doc(iduser).collection("credentialsbcp").add({
              nrocuenta: nrocuenta //password,

            });

          case 6:
            _context3.next = 8;
            return _index.database.collection("users").doc(iduser).collection("accountbcp").doc(nrocuenta).set({
              saldo: 500.0,
              incoming_transfer: [],
              //transferencias entrantes
              outgoing_transfer: [] //transferencias salientes

            });

          case 8:
            return _context3.abrupt("return", Promise.resolve( //return
            {
              FillToFirebaseUser: true
            }));

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](1);
            throw _context3.t0;

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 11]]);
  }));

  return function IngestUserToFirebaseUser(_x9) {
    return _ref5.apply(this, arguments);
  };
}();