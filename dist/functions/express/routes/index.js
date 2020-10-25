"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../datalayer/backing/firebase/index");

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _passport = _interopRequireDefault(require("passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index2 = require("../controllers/index");

var _index3 = require("../../../datalayer/backing/sendgrid/index");

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var routes = (0, _express.Router)(); // routes.post("/sendemailprueba", async (req, res) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: "daniechoque159@gmail.com", // Change to your recipient
//     from: `Activacion BCP <${process.env.EMAIL_BCPNOTIFY_SENDGRID_SENDER_ACTIVATION}>`,
//     //from: "bcpnotify@choquesaurus.com", // Change to your verified sender
//     subject: "Necesitas activar tu cuenta",
//     //text: msj,
//     html: TemplateHTMLActiveLinkEmail(
//       "choquesaurus.com",
//       "aosjdiojqwiojeiowqje"
//     ),
//   };
//   try {
//     await sgMail.send(msg);
//     return res.send({ message: "email enviado" });
//   } catch (error) {
//     return res.send({ message: error.message });
//   }
// });

routes.get("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", res.send({
              mesage: "Hello"
            }));

          case 1:
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
routes.get("/verifytoken", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = req.query.token;

            _jsonwebtoken["default"].verify(token, process.env.SECRET_JWT_CRYPTOTOKENVALIDATEUSER, function (error, data) {
              if (error) return res.send({
                message: error.message
              });

              _index.database.collection("users").doc(data.iduser).update({
                validUser: {
                  isVerified: true,
                  token: ""
                }
              }).then(function (result) {
                return res.send({
                  message: "Tu cuenta se ha activado correctamente , ya puedes inicar sesión ."
                });
              })["catch"](function (error) {
                return res.send({
                  message: error.message
                });
              });
            }); // database.collection("users").where("validUser.token", "==", token);
            // database
            //   .collection("users")
            //   .doc(id)
            //   .set(
            //     {
            //       validUser: {
            //         isVerified: true,
            //         token: "",
            //       },
            //     },
            //     { merge: true }
            //   )
            //   .then((result) => {
            //     return res.send({ message2: result });
            //   })
            //   .catch((error) => {
            //     return res.send({ message: error.message });
            //   });
            //return res.send({ message: req.query });


          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
routes.get("/logout", function (req, res) {
  console.log("logout user ", req.user);
  req.logOut();
  console.log("logout user ", req.user);
  console.log("logout session ", req.session);
  return res.redirect(process.env.failureRedirect);
});
routes.post("/login", _index2.isVerified, _passport["default"].authenticate("local", {
  successRedirect: process.env.successRedirect,
  failureRedirect: process.env.failureRedirect
}));
routes.get("/user", function (req, res) {
  // console.log(req.isAuthenticated());
  try {
    if (req.user) return res.json(req.user);
  } catch (error) {
    return res.send({
      message: error.message
    });
  }
});
routes.get("/authenticate", function (req, res, next) {
  if (req.user == null || req.user == undefined) return res.send({
    status: false
  });
  return res.send({
    status: true
  });
});
routes.post("/sendMessageWithToken", function (req, res) {
  var _req$body = req.body,
      To_Token = _req$body.To_Token,
      _req$body$mesage = _req$body.mesage,
      mesage = _req$body$mesage === void 0 ? "Tal persona te ha transferido" : _req$body$mesage,
      _req$body$url = _req$body.url,
      url = _req$body$url === void 0 ? "https://choquesaurus.com" : _req$body$url,
      _req$body$title = _req$body.title,
      title = _req$body$title === void 0 ? "Tranferencia entrante" : _req$body$title;
  var message = {
    data: {
      url: url,
      title: title,
      body: mesage,
      icon: "https://i.ytimg.com/vi/TZLEYI1IrFU/hqdefault.jpg"
    },
    token: To_Token
  }; //   // const data_response = await admin.messaging().send(message);

  _firebaseAdmin["default"].messaging().send(message).then(function (response) {
    // Response is a message ID string.
    return res.send({
      message: "Se envio el mensaje correctamente"
    }); //console.log('Successfully sent message:', response);
  })["catch"](function (error) {
    console.log("Error sending message:", error);
    return res.send({
      message: "No envio el mensaje correctamente"
    });
  });
});
routes.post("/transferdetails", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$body2, _req$body2$idUsuarioA, idUsuarioActual, _req$body2$idtransfer, idtransferencia, data_result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, _req$body2$idUsuarioA = _req$body2.idUsuarioActual, idUsuarioActual = _req$body2$idUsuarioA === void 0 ? "" : _req$body2$idUsuarioA, _req$body2$idtransfer = _req$body2.idtransferencia, idtransferencia = _req$body2$idtransfer === void 0 ? "" : _req$body2$idtransfer;
            _context3.next = 3;
            return _index.database.collection("users").doc(idUsuarioActual).collection("incoming_transfer").doc(idtransferencia).get();

          case 3:
            data_result = _context3.sent;
            res.send({
              data: data_result.data()
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
routes.post("/signup", _index2.validate_create_new_user); // routes.post("/signup2", async (req, res) => {
//   const {
//     nrocuenta,
//     password, //bcrypt
//     photoURL = "https://cdn3.f-cdn.com/contestentries/1269942/15600440/5a991c82be987_thumb900.jpg",
//     email,
//     name,
//     address,
//     age,
//   } = req.body;
//   database
//     .collection("users")
//     .add({
//       created: true,
//       //uid: user.uid,
//       details_create: {
//         creationTime: new Date().toDateString(), //metadata.creationTime
//         device: "",
//       },
//       details_user: { console.log(token)
//         name,
//         address,
//         photoURL,
//         //displayName: user.displayName,
//         email,
//         nrocuenta,
//         age,
//       },
//       token: "",
//       //tokens: [],
//     })
//     .then(async (refUser) => {
//       try {
//         await refUser.collection("credentialsbcp").add({
//           nrocuenta,
//           password,
//         });
//         await refUser.collection("accountbcp").doc(nrocuenta).set({
//           saldo: 500.0,
//           incoming_transfer: [], //transferencias entrantes
//           outgoing_transfer: [], //transferencias salientes
//         });
//         return res.send({ message: "Se creo correctamente el usuario" });
//       } catch (error) {
//         return res.send({ message: error.message });
//       }
//       // .then((result) =>
//       //   res.send({ message: "Se creo correctamente el usuario" })
//       // )
//       // .catch((error) => res.send({ message: error.message }));
//     })
//     .catch((error) => res.send({ message: error.message }));
//   //return res.send({ message: "Hello :)" });
// });

routes.post("/transfer", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var _req$body3, _req$body3$depositoOr, depositoOrTranferencia, _req$body3$cuentaemis, cuentaemisora, cuentareceptora, _req$body3$idUsuarioQ, idUsuarioQueDepositaraOEmisor, refCollectionsUser;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body3 = req.body, _req$body3$depositoOr = _req$body3.depositoOrTranferencia, depositoOrTranferencia = _req$body3$depositoOr === void 0 ? "" : _req$body3$depositoOr, _req$body3$cuentaemis = _req$body3.cuentaemisora, cuentaemisora = _req$body3$cuentaemis === void 0 ? "" : _req$body3$cuentaemis, cuentareceptora = _req$body3.cuentareceptora, _req$body3$idUsuarioQ = _req$body3.idUsuarioQueDepositaraOEmisor, idUsuarioQueDepositaraOEmisor = _req$body3$idUsuarioQ === void 0 ? "" : _req$body3$idUsuarioQ;
            refCollectionsUser = _index.database.collection("users");
            _context6.next = 4;
            return refCollectionsUser.where("details_user.nrocuenta", "==", cuentareceptora).limit(1).get().then( /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(results) {
                var idUsuarioReceptor, idUsuarioEmisor, refEmisor, refReceptor, refAccountBcpEmisor, refAccountBcpReceptor, montoActualAccountEmisor, montoActualAccountReceptor;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (results.docs[0] && "details_user" in results.docs[0].data()) {
                          _context5.next = 2;
                          break;
                        }

                        throw new Error("No existe el ususarios");

                      case 2:
                        idUsuarioReceptor = results.docs[0].id;
                        idUsuarioEmisor = idUsuarioQueDepositaraOEmisor;
                        refEmisor = refCollectionsUser.doc(idUsuarioEmisor);
                        refReceptor = refCollectionsUser.doc(idUsuarioReceptor);
                        refAccountBcpEmisor = refCollectionsUser.doc(idUsuarioEmisor).collection("accountbcp").doc(cuentaemisora);
                        refAccountBcpReceptor = refCollectionsUser.doc(idUsuarioReceptor).collection("accountbcp").doc(cuentareceptora);
                        _context5.next = 10;
                        return refAccountBcpEmisor.get();

                      case 10:
                        _context5.next = 12;
                        return _context5.sent.data().saldo;

                      case 12:
                        montoActualAccountEmisor = _context5.sent;

                        if (!(depositoOrTranferencia > montoActualAccountEmisor || montoActualAccountEmisor <= 0)) {
                          _context5.next = 15;
                          break;
                        }

                        throw new Error("Saldo insufiente , recarga");

                      case 15:
                        _context5.next = 17;
                        return refAccountBcpReceptor.get();

                      case 17:
                        _context5.next = 19;
                        return _context5.sent.data().saldo;

                      case 19:
                        montoActualAccountReceptor = _context5.sent;
                        _context5.next = 22;
                        return refAccountBcpEmisor.update({
                          saldo: montoActualAccountEmisor - depositoOrTranferencia
                        });

                      case 22:
                        refEmisor.collection("outgoing_transfer").add({
                          saldo_antiguo: montoActualAccountEmisor,
                          saldo_nuevo: montoActualAccountEmisor - depositoOrTranferencia,
                          monto_tranferido: depositoOrTranferencia,
                          cuenta_receptora: cuentareceptora,
                          hour_tranfer: new Date().toLocaleString()
                        }) // .update({
                        //   outgoing_transfer: firebaseAdmin.firestore.FieldValue.arrayUnion({
                        //     saldo_antiguo: montoActualAccountEmisor,
                        //     saldo_nuevo: montoActualAccountEmisor - depositoOrTranferencia,
                        //     transferencia_entrante: depositoOrTranferencia,
                        //     to_account_send: cuentareceptora,
                        //     hour_tranfer: new Date().toDateString(),
                        //   }), //transferencia saliente
                        //   saldo: montoActualAccountEmisor - depositoOrTranferencia,
                        // })
                        .then( /*#__PURE__*/function () {
                          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(results_bcpEmisor_outgoing_transfer) {
                            var _yield$yield$refEmiso, _yield$yield$refEmiso2, name, last_name, nrocuenta, _yield$yield$refRecep, TokenReceptor, _yield$refReceptor$co, id_incoming_transfer_receptor, MessageNotificationReceptor;

                            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    _context4.next = 2;
                                    return refAccountBcpReceptor.update({
                                      saldo: montoActualAccountReceptor + depositoOrTranferencia
                                    });

                                  case 2:
                                    _context4.next = 4;
                                    return refEmisor.get();

                                  case 4:
                                    _context4.next = 6;
                                    return _context4.sent.data();

                                  case 6:
                                    _yield$yield$refEmiso = _context4.sent;
                                    _yield$yield$refEmiso2 = _yield$yield$refEmiso.details_user;
                                    name = _yield$yield$refEmiso2.name;
                                    last_name = _yield$yield$refEmiso2.last_name;
                                    nrocuenta = _yield$yield$refEmiso2.nrocuenta;
                                    _context4.next = 13;
                                    return refReceptor.get();

                                  case 13:
                                    _context4.next = 15;
                                    return _context4.sent.data();

                                  case 15:
                                    _yield$yield$refRecep = _context4.sent;
                                    TokenReceptor = _yield$yield$refRecep.token;
                                    _context4.next = 19;
                                    return refReceptor.collection("incoming_transfer").add({
                                      saldo_antiguo: montoActualAccountReceptor,
                                      saldo_nuevo: montoActualAccountReceptor + depositoOrTranferencia,
                                      monto_tranferido: depositoOrTranferencia,
                                      cuenta_emisora: cuentaemisora,
                                      hour_tranfer: new Date().toLocaleString(),
                                      details_user_emisor: {
                                        name: name,
                                        last_name: last_name
                                      }
                                    });

                                  case 19:
                                    _yield$refReceptor$co = _context4.sent;
                                    id_incoming_transfer_receptor = _yield$refReceptor$co.id;
                                    //const {details_user:{email,nrocuenta}=await (await refEmisor.get()).data();
                                    //const token={email,address,nrocuenta}=await (await refReceptor.get()).data();
                                    MessageNotificationReceptor = {
                                      data: {
                                        url: "".concat(process.env.urlorigin, "/bcp/details/").concat(id_incoming_transfer_receptor),
                                        //"https://choquesaurus.com",
                                        title: "transferencia entrante",
                                        body: "".concat(name, " ").concat(last_name, " con el numero de cuenta ").concat(nrocuenta, " te acaba de tranferir ").concat(depositoOrTranferencia, " . \n Click aqu\xED para ver el detalle de la transferencia"),
                                        icon: "https://i.ytimg.com/vi/TZLEYI1IrFU/hqdefault.jpg"
                                      },
                                      token: TokenReceptor //token de receptor,

                                    };
                                    _context4.next = 24;
                                    return _firebaseAdmin["default"].messaging().send(MessageNotificationReceptor);

                                  case 24:
                                    return _context4.abrupt("return", res.send({
                                      message: "Transferencia correcta",
                                      data: {
                                        to_account_transfer: cuentareceptora,
                                        id_incoming_transfer_receptor: id_incoming_transfer_receptor,
                                        MessageNotificationReceptor: MessageNotificationReceptor
                                      }
                                    }));

                                  case 25:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee4);
                          }));

                          return function (_x10) {
                            return _ref6.apply(this, arguments);
                          };
                        }()); //refAccountBcpEmisor.update({saldo:})
                        // return res.send({
                        //   message:
                        //     "Saldo actual en la cuenta del emisor " + montoActualAccountEmisor,
                        // });

                      case 23:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x9) {
                return _ref5.apply(this, arguments);
              };
            }())["catch"](function (error) {
              return res.send({
                message: error.message
              });
            });

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
var _default = routes;
exports["default"] = _default;