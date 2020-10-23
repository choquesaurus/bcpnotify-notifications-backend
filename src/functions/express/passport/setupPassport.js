import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import ModelUser from "../models/users";
import bcrypt from "bcryptjs";
//import { database } from "../../../datalayer/backing/firebase/index";
passport.serializeUser((user, done) => {
  done(null, user.iduser);
});

// passport.deserializeUser(async (iduser, done) => {
//   const findUser = await ModelUser.findOne({
//     attributes: ["iduser", "nrocuenta"],
//     where: { iduser },
//   });

//   done(null, findUser == null ? {} : findUser.dataValues);
// });

passport.deserializeUser(async (iduser, done) => {
  // database
  //   .collection("users")
  //   .doc(iduser)
  //   .get()
  //   .then((result) => {
  //     done(null, { ...result.data().details_user, iduser });
  //   })
  //   .catch((error) => {
  //     done(null, {});
  //   });

  const findUser = await ModelUser.findOne({
    attributes: [
      "iduser",
      //, "nrocuenta"
    ],
    where: { iduser },
  });

  done(null, findUser == null ? {} : findUser);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (username, password, done) {
      const searchuser = await ModelUser.findOne({
        attributes: ["iduser", "email", "password"],
        where: {
          email: username,
        },
      });
      //console.log(searchuser.dataValues);
      // const data = "sad";

      if (searchuser != null && searchuser.dataValues.hasOwnProperty("email")) {
        //MEJORAR VALIDACION DE BCRYPT  --> FUNCIONANDO :D
        if (bcrypt.compareSync(password, searchuser.dataValues.password)) {
          console.log("1", "1 Contraseña correcto o credenciales correctas");
          delete searchuser.dataValues.password;
          return done(null, searchuser.dataValues);
        }
        if (
          bcrypt.compareSync(password, searchuser.dataValues.password) == false
        ) {
          console.log("2", "Contraseña correcto ");
          delete searchuser.dataValues.password;
          return done(null, false);
        }
        console.log("3", "3 Usuario correcto o credenciales correctas");
        delete searchuser.dataValues.password;
        return done(null, searchuser.dataValues);
      }
      console.log("4", "error credenciales incorrectas");
      return done(null, false);
    }
  )
);
