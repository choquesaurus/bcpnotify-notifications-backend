if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
//import "@babel/polyfill";
import express from "express";
import cors from "cors";
//import morgan from "morgan";
import ConnectionSequalize from "./connection/index";
import routes from "./routes/index";
import passportSetup from "./passport/setupPassport";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
//import expressSession from "express-session";
import passport from "passport";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class Aplication {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    //this.app.use(morgan("dev"));
    this.app.use(cookieParser(process.env.keyCookie));
    // this.app.use(
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

    this.app.use(
      cookieSession({
        name: "session",
        keys: [process.env.keyCookie],
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(
      cors({
        origin: process.env.urlorigin,
        //origin: "https://auth.choquesaurus.com", // allow to server to accept request from different origin
        //origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // allow session cookie from browser to pass through
      })
    );
  }

  routes() {
    this.app.use("/", routes);
  }
  start() {
    this.app.listen(process.env.PORT || 5020, () => {
      console.log(`Run server in localhost:5020`);
    });
  }
}

new Aplication().start();
