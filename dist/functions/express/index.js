"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _index = _interopRequireDefault(require("./connection/index"));

var _index2 = _interopRequireDefault(require("./routes/index"));

var _setupPassport = _interopRequireDefault(require("./passport/setupPassport"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cookieSession = _interopRequireDefault(require("cookie-session"));

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
} //import "@babel/polyfill";


//import sgMail from "@sendgrid/mail";
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var Aplication = /*#__PURE__*/function () {
  function Aplication() {
    _classCallCheck(this, Aplication);

    this.app = (0, _express["default"])();
    this.config();
    this.routes();
  }

  _createClass(Aplication, [{
    key: "config",
    value: function config() {
      this.app.use(_express["default"].json());
      this.app.use(_express["default"].urlencoded({
        extended: true
      })); //this.app.use(morgan("dev"));

      this.app.use((0, _cookieParser["default"])(process.env.keyCookie)); // this.app.use(
      //   expressSession({
      //     secret: process.env.keyCookie,
      //     cookie: {
      //       maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      //     },
      //     //store: store,
      //     resave: false,
      //     saveUninitialized: false,
      //     cookie: { secure: false }, // Remember to set this
      //   })
      // );

      this.app.use((0, _cookieSession["default"])({
        name: "session",
        keys: [process.env.keyCookie]
      }));
      this.app.use(_passport["default"].initialize());
      this.app.use(_passport["default"].session());
      this.app.use((0, _cors["default"])({
        origin: process.env.urlorigin,
        //origin: "https://auth.choquesaurus.com", // allow to server to accept request from different origin
        //origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through

      }));
    }
  }, {
    key: "routes",
    value: function routes() {
      this.app.use("/", _index2["default"]);
    }
  }, {
    key: "start",
    value: function start() {
      this.app.listen(process.env.PORT || 5016, function () {
        console.log("Run server inn localhost:5016");
      });
    }
  }]);

  return Aplication;
}();

new Aplication().start();