if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
import ModelUser from "../models/users";
import bcrypt from "bcryptjs";
import uid from "uid";
import { database } from "../../../datalayer/backing/firebase/index";
//import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import { TemplateHTMLActiveLinkEmail } from "../../../datalayer/backing/sendgrid/index";

export async function isVerified(req, res, next) {
  // if (!(results.docs[0] && "details_user" in results.docs[0].data())) {
  //   throw new Error("No existe el ususarios");
  // }

  const { email } = req.body;
  const result = await database
    .collection("users")
    .where("details_user.email", "==", email)
    .where("validUser.isVerified", "==", true)
    .get();
  // .then((data) => {
  //   res.send({ message: data.docs[0].data() });
  // })
  // .catch((error) => {
  //   return res.send({ message: error.mesage });
  // });
  if (!(result.docs[0] && "details_user" in result.docs[0].data())) {
    //res.send({ message: "errore sadj" });
    return res.redirect(process.env.failureRedirect);
  }
  return next();

  //return res.send({ data: result.docs[0].data() });
}
export const validate_create_new_user = async (req, res) => {
  try {
    let usercreated = {};
    //const { nrocuenta, password } = req.body;
    const { password, ...rest } = req.body;
    //Buscar en la tabla el siguiente numero de cuenta :) :)
    const searchuser = await ModelUser.findOne({
      where: {
        email: rest.email,
      },
    });

    //VALIDAR PARAMETROS
    validateParams(rest);

    //Validar si existe  o no
    if (searchuser === null) {
      //el usuario no existe --> se crea un nuevo usuario
      var hash_password = bcrypt.hashSync(password, 10);
      usercreated = await ModelUser.create(
        {
          iduser: `${uid(32)}-${new Date().toLocaleTimeString()}`,
          email: rest.email,
          password: hash_password,
          // telephone,
        },
        {
          fields: [
            "iduser",
            "email",
            "password",
            // "telephone"
          ],
        }
      );
      delete usercreated._previousDataValues.password;
      delete usercreated.dataValues.password;
      //Poblar Informacion en Firebase --> Collection (users)
      console.log("creado", usercreated.dataValues.iduser);
      //CREACION DE TOKEN DE USUARIO PARA CREAR LINK DE VALIDACION
      //Y ACTIVACION

      //const cryptoTokenValidateUser = crypto.randomBytes(20).toString("HEX");

      const cryptoTokenValidateUser = jwt.sign(
        { iduser: usercreated.dataValues.iduser },
        process.env.SECRET_JWT_CRYPTOTOKENVALIDATEUSER,
        { expiresIn: "1d" }
      );
      const { FillToFirebaseUser } = await IngestUserToFirebaseUser({
        ...rest,
        iduser: usercreated.dataValues.iduser,
        cryptoTokenValidateUser,
      });

      // AGREGAR API KEY => SEND GRID MAIL
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      //OBTENER LINK DE LA APLICACION BASE
      const urlbase = `${req.protocol}://${req.headers.host}`;
      await VerifyAccountEmailAddress(
        rest.email,
        cryptoTokenValidateUser,
        urlbase
      );
      return res.send({
        //message: `El numero de cuenta ${nrocuenta} se creo correctamente`,
        message: `Se envio un link de activacion  a tu correo ${rest.email}`,
        status: 1,
        the_user_was_created: true,
        user_information_created: {
          iduser: usercreated.dataValues.iduser,
          email: usercreated.dataValues.email,
          // telephone: usercreated.dataValues.telephone,
        },
        FillToFirebaseUser,
      });
    }
    if ("email" in searchuser && searchuser !== null) {
      //ya existe el usuario
      throw Error(`El correo ${rest.email} ya esta asociado u creado`);
    }

    // const users = await ModelUser.findAll();
    res.send({ message: "default" });
  } catch (error) {
    return res.send({
      message: error.message,
      status: 0,
      the_user_was_created: false,
      FillToFirebaseUser: false,
    });
  }
};
const validateParams = ({ nrocuenta }) => {
  if (nrocuenta.length > 14) {
    throw new Error("nro de cuenta excede los 14 digitos");
  }
};

const VerifyAccountEmailAddress = async (email, cryptoToken, urlbase) => {
  const msg = {
    to: email, // Change to your recipient
    from: `Activacion BCP <${process.env.EMAIL_BCPNOTIFY_SENDGRID_SENDER_ACTIVATION}>`,
    //from: "bcpnotify@choquesaurus.com", // Change to your verified sender
    subject: "Necesitas activar tu cuenta",
    html: TemplateHTMLActiveLinkEmail(cryptoToken, urlbase),
    //html: "<a href='https://choquesaurus.com' target='_blank'>activar link</a>",
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};

const IngestUserToFirebaseUser = async ({
  nrocuenta,
  // password, //bcrypt
  photoURL = "https://cdn3.f-cdn.com/contestentries/1269942/15600440/5a991c82be987_thumb900.jpg",
  email,
  name,
  last_name,
  age,
  iduser,
  cryptoTokenValidateUser,
}) => {
  //return new Promise(async(resolve, reject) => {

  try {
    await database
      .collection("users")
      .doc(iduser)
      .set(
        //.add(
        {
          created: true,
          //uid: user.uid,
          details_create: {
            creationTime: new Date().toDateString(), //metadata.creationTime
            device: "",
          },
          details_user: {
            name,
            last_name,
            photoURL,
            //displayName: user.displayName,
            email,
            nrocuenta,
            age,
          },
          validUser: {
            isVerified: false,
            token: cryptoTokenValidateUser,
          },
          token: "",
          //tokens: [],
        }
      );
    await database
      .collection("users")
      .doc(iduser)
      .collection("credentialsbcp")
      .add({
        nrocuenta,
        //password,
      });
    await database
      .collection("users")
      .doc(iduser)
      .collection("accountbcp")
      .doc(nrocuenta)
      .set({
        saldo: 500.0,
        incoming_transfer: [], //transferencias entrantes
        outgoing_transfer: [], //transferencias salientes
      });
    return Promise.resolve(
      //return
      {
        FillToFirebaseUser: true,
      }
    );
  } catch (error) {
    throw error;
  }

  // database
  //   .collection("users")
  //   .doc(iduser)
  //   .set(
  //     //.add(
  //     {
  //       created: true,
  //       //uid: user.uid,
  //       details_create: {
  //         creationTime: new Date().toDateString(), //metadata.creationTime
  //         device: "",
  //       },
  //       details_user: {
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
  //     }
  //   )
  //   .then(async (refUser) => {
  //     try {
  //       await refUser.collection("credentialsbcp").add({
  //         nrocuenta,
  //         //password,
  //       });
  //       await refUser.collection("accountbcp").doc(nrocuenta).set({
  //         saldo: 500.0,
  //         incoming_transfer: [], //transferencias entrantes
  //         outgoing_transfer: [], //transferencias salientes
  //       });
  //       resolve({
  //         IngestUserToFirebaseUser: true,
  //       });
  //       //return res.send({ message: "Se creo correctamente el usuario" });
  //     } catch (error) {
  //       reject({
  //         IngestUserToFirebaseUser: false,
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     reject({
  //       IngestUserToFirebaseUser: false,
  //     });
  //   });
  // });
};
