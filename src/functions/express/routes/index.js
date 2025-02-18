if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
import { Router } from "express";
import { database } from "../../../datalayer/backing/firebase/index";
import firebaseAdmin from "firebase-admin";
import passport from "passport";
import jwt from "jsonwebtoken";
import { validate_create_new_user, isVerified } from "../controllers/index";
//import { TemplateHTMLActiveLinkEmail } from "../../../datalayer/backing/sendgrid/index";
//import sgMail from "@sendgrid/mail";
const routes = Router();

routes.get("/", async (req, res) => {
  // if (!(results.docs[0] && "details_user" in results.docs[0].data())) {
  //   throw new Error("No existe el ususarios");
  // }
  return res.send({ mesage: "Hello" });
  // const result = await database
  //   .collection("users")
  //   .where("details_user.email", "==", "daniechoque159@gmail.com")
  //   .where("validUser.isVerified", "==", true)
  //   .get();
  // // .then((data) => {
  // //   res.send({ message: data.docs[0].data() });
  // // })
  // // .catch((error) => {
  // //   return res.send({ message: error.mesage });
  // // });
  // if (!(result.docs[0] && "details_user" in result.docs[0].data())) {
  //   return res.send({ message: "errore sadj" });
  // }
  // return res.send({ data: result.docs[0].data() });
  // console.log(result.docs[0].data());
  // return res.send({ mes: "sadoijwq" });
});

routes.get("/verifytoken", async (req, res) => {
  const { token } = req.query;
  jwt.verify(
    token,
    process.env.SECRET_JWT_CRYPTOTOKENVALIDATEUSER,
    (error, data) => {
      if (error) return res.send({ message: error.message });
      database
        .collection("users")
        .doc(data.iduser)
        .update({
          validUser: {
            isVerified: true,
            token: "",
          },
        })
        .then((result) => {
          return res.send({
            message:
              "Tu cuenta se ha activado correctamente , ya puedes inicar sesión .",
          });
        })
        .catch((error) => {
          return res.send({ message: error.message });
        });
    }
  );

  // database.collection("users").where("validUser.token", "==", token);
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
});

routes.get("/logout", (req, res) => {
  console.log("logout user ", req.user);
  req.logOut();

  console.log("logout user ", req.user);
  console.log("logout session ", req.session);
  return res.redirect(process.env.failureRedirect);
});

routes.post(
  "/login",
  isVerified,
  passport.authenticate("local", {
    successRedirect: process.env.successRedirect,
    failureRedirect: process.env.failureRedirect,
  })
);
routes.get("/user", (req, res) => {
  // console.log(req.isAuthenticated());
  try {
    if (req.user) return res.json(req.user);
  } catch (error) {
    return res.send({ message: error.message });
  }
});
routes.get("/authenticate", (req, res, next) => {
  if (req.user == null || req.user == undefined)
    return res.send({ status: false });

  return res.send({ status: true });
});
routes.post("/sendMessageWithToken", (req, res) => {
  const {
    To_Token,
    mesage = "Tal persona te ha transferido",
    url = "https://choquesaurus.com", //localhost:3000/detailstransfer/:id
    title = "Tranferencia entrante",
  } = req.body;
  const message = {
    data: {
      url: url,
      title,
      body: mesage,
      icon: "https://i.ytimg.com/vi/TZLEYI1IrFU/hqdefault.jpg",
    },
    token: To_Token,
  };
  //   // const data_response = await admin.messaging().send(message);
  firebaseAdmin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      return res.send({ message: "Se envio el mensaje correctamente" });
      //console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      return res.send({ message: "No envio el mensaje correctamente" });
    });
});
routes.post("/transferdetails", async (req, res) => {
  const { idUsuarioActual = "", idtransferencia = "" } = req.body;
  const data_result = await database
    .collection("users")
    .doc(idUsuarioActual)
    .collection("transfers")
    //.collection("incoming_transfer")
    .doc(idtransferencia)
    .get();
  res.json(data_result.data());
});
// routes.post("/alltransfers", async (req, res) => {
//   const { idUsuarioActual } = req.body;
//   try {
//     const listTotal = await database
//       .collection("users")
//       .doc(idUsuarioActual)
//       .collection("transfers")
//       .orderBy("timestamp", "desc")
//       .get();

//     const result_listTotal = listTotal.docs.map((data) =>
//       Object.assign({ id: data.id }, data.data())
//     );
//     return res.json(result_listTotal);
//   } catch (error) {
//     return res.send({ message: error.message });
//   }
//   //return res.send({ messa: false });
// });
routes.post("/signup", validate_create_new_user);
routes.post("/searchbynrocuenta", async (req, res) => {
  const { nrocuenta } = req.body;
  // const data_result = await database
  //   .collection("users")
  //   .where("details_user.nrocuenta", "==", nrocuenta)
  //   //.limit(1)
  //   .get();

  //   if (!(data_result.docs[0] && "details_user" in data_result.docs[0].data())) {
  //     //res.send({ message: "errore sadj" });
  //     return res.redirect(process.env.failureRedirect);
  //   }
  // return res.send({ data: data_result.docs[0].data() });

  // db.collection('comments').where("user","==",data_add.user).get().then(user_exists=>{
  //   console.log(`Ya existe el usuario `,user_exists.docs[0].data().user)
  // }).catch(async user_noexists=>{
  //   const add_document = await db.collection('comments').add(data_add)
  //   console.log("Se Agrero uno nuevo ",add_document.id)
  // })
  //console.log("RESULTADO ", result.docs[0].data());
  try {
    const request_result = await database
      .collection("users")
      .where("details_user.nrocuenta", "==", nrocuenta)
      .limit(1)
      .get();
    if (
      request_result.docs[0] &&
      "details_user" in request_result.docs[0].data()
    ) {
      const { name, last_name } = request_result.docs[0].data().details_user;
      return res.send({
        found: true,
        message: `Deseas transferir a ${name} ${last_name} con el numero de cuenta ${nrocuenta}`,
      });
    }
    return res.send({
      found: false,
      message: `No existe el numero de cuenta ${nrocuenta}`,
    });
  } catch (error) {
    return res.send({ found: false, message: error.message });
  }

  // if (!(result.docs[0] && "details_user" in result.docs[0].data())) {
  // }
  // database
  //   .collection("users")
  //   .where("details_user.nrocuenta", "==", nrocuenta)
  //   .limit(1)
  //   .get()
  //   //.limit(1)
  //   //.get()
  //   //.limit()
  //   .then((result) => {
  //     return res.send({ data: result.docs[0].data() });
  //   })
  //   .catch((error) => {
  //     //console.log(error.message);
  //     return res.send({
  //       error: error.message,
  //       message: `No existe el numero de cuenta : ${nrocuenta}`,
  //     });
  //   });
});
routes.post("/transfer", async (req, res) => {
  const {
    depositoOrTranferencia = "",
    cuentaemisora = "",
    cuentareceptora,
    idUsuarioQueDepositaraOEmisor = "",
  } = req.body;

  const refCollectionsUser = database.collection("users");

  await refCollectionsUser
    .where("details_user.nrocuenta", "==", cuentareceptora)
    .limit(1)
    .get()
    .then(async (results) => {
      if (!(results.docs[0] && "details_user" in results.docs[0].data())) {
        throw new Error("No existe el ususarios");
      }
      const idUsuarioReceptor = results.docs[0].id;
      const idUsuarioEmisor = idUsuarioQueDepositaraOEmisor;
      const refEmisor = refCollectionsUser.doc(idUsuarioEmisor);
      const refReceptor = refCollectionsUser.doc(idUsuarioReceptor);
      const refAccountBcpEmisor = refCollectionsUser
        .doc(idUsuarioEmisor)
        .collection("accountbcp")
        .doc(cuentaemisora);
      const refAccountBcpReceptor = refCollectionsUser
        .doc(idUsuarioReceptor)
        .collection("accountbcp")
        .doc(cuentareceptora);
      const montoActualAccountEmisor = await (
        await refAccountBcpEmisor.get()
      ).data().saldo;
      if (
        depositoOrTranferencia > montoActualAccountEmisor ||
        montoActualAccountEmisor <= 0
      ) {
        throw new Error("Saldo insufiente , recarga");
      }

      const montoActualAccountReceptor = await (
        await refAccountBcpReceptor.get()
      ).data().saldo;
      await refAccountBcpEmisor.update({
        saldo: Number(
          parseFloat(montoActualAccountEmisor - depositoOrTranferencia).toFixed(
            2
          )
        ),
      });
      const {
        details_user: { name, last_name },
      } = await (await refReceptor.get()).data();

      /*  CLOSE COLLECTION outgoing_transfer  */
      refEmisor
        /* SE ELIMINA COLECCION OUTGOING_TRANSFER*/

        //.collection("outgoing_transfer")

        /* AHORA SE ALMACENARA EN LA COLECCIÓN TRANSFERS*/
        .collection("transfers")
        .add({
          saldo_antiguo: montoActualAccountEmisor,
          saldo_nuevo: Number(
            parseFloat(
              montoActualAccountEmisor - depositoOrTranferencia
            ).toFixed(2)
          ),

          monto_transferido: depositoOrTranferencia,
          cuenta_receptora: cuentareceptora,
          //hour_transfer: new Date().toLocaleString("en-US"),
          hour_transfer: new Date().toString(),
          type: "outgoing_transfer",
          timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          details_user_transfer: {
            name,
            last_name,
          },
        })

        // .update({
        //   outgoing_transfer: firebaseAdmin.firestore.FieldValue.arrayUnion({
        //     saldo_antiguo: montoActualAccountEmisor,
        //     saldo_nuevo: montoActualAccountEmisor - depositoOrTranferencia,
        //     transferencia_entrante: depositoOrTranferencia,
        //     to_account_send: cuentareceptora,
        //     hour_tranfer: new Date().toDateString(),
        //   }), //transferencia saliente
        //   saldo: montoActualAccountEmisor - depositoOrTranferencia,
        // })
        .then(async (results_bcpEmisor_outgoing_transfer) => {
          await refAccountBcpReceptor.update({
            saldo: Number(
              parseFloat(
                montoActualAccountReceptor + depositoOrTranferencia
              ).toFixed(2)
            ),
          });

          /*
          ARREGLAR TOKEN TO_TOKEN ERRONEO ---> DEBE SER A RECEPTOR MAS  NO EMISOR
          */
          const {
            details_user: { name, last_name, nrocuenta },
          } = await (await refEmisor.get()).data();
          const { token: TokenReceptor } = await (
            await refReceptor.get()
          ).data();
          // const {details_user:{name,address,nrocuenta},token:To_Token}=await (await refEmisor.get()).data();

          /* SE ELIMINA COLECCION incoming_transfer*/

          //.collection("incoming_transfer")

          /* AHORA SE ALMACENARA EN LA COLECCIÓN TRANSFERS*/

          const {
            id: id_incoming_transfer_receptor,
            //} = await refReceptor.collection("transfers").add({
          } = await refReceptor.collection("transfers").add({
            saldo_antiguo: montoActualAccountReceptor,
            saldo_nuevo: Number(
              parseFloat(
                montoActualAccountReceptor + depositoOrTranferencia
              ).toFixed(2)
            ),
            monto_transferido: depositoOrTranferencia,
            cuenta_emisora: cuentaemisora,
            //hour_transfer: new Date().toLocaleString("en-US"),
            hour_transfer: new Date().toString(),
            type: "incoming_transfer",
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            details_user_transfer: {
              name,
              last_name,
            },
          });

          //const {details_user:{email,nrocuenta}=await (await refEmisor.get()).data();
          //const token={email,address,nrocuenta}=await (await refReceptor.get()).data();
          const MessageNotificationReceptor = {
            data: {
              url: `${process.env.urlorigin}/bcp/details/${id_incoming_transfer_receptor}`, //"https://choquesaurus.com",
              title: "transferencia entrante",
              body: `${name} ${last_name} con el numero de cuenta ${nrocuenta} te acaba de tranferir ${depositoOrTranferencia} . \n Click aquí para ver el detalle de la transferencia`,
              icon: "https://i.ytimg.com/vi/TZLEYI1IrFU/hqdefault.jpg",
            },
            token: TokenReceptor, //token de receptor,
          };
          await firebaseAdmin.messaging().send(MessageNotificationReceptor);
          // const {
          //   To_Token,
          //   mesage = "Tal persona te ha transferido",
          //   url = "https://choquesaurus.com", //localhost:3000/detailstransfer/:id
          //   title = "Tranferencia entrante",
          // } = req.body;
          /** EN ESTA PARTE SE NOTIFICA AL RECEPTOR :) */

          // await refAccountBcpReceptor.update({
          //   incoming_transfer: [], //transferencia entrante
          //   saldo: montoActualAccountReceptor + depositoOrTranferencia,
          // });

          return res.send({
            status: true,
            message: "Transferencia correcta",
            to_account_transfer: cuentareceptora,
            // data: {

            //   //id_incoming_transfer_receptor,
            //   // MessageNotificationReceptor,
            // },
          });
        });

      //refAccountBcpEmisor.update({saldo:})
      // return res.send({
      //   message:
      //     "Saldo actual en la cuenta del emisor " + montoActualAccountEmisor,
      // });
    })
    .catch((error) => res.send({ status: false, message: error.message }));
  // if (!(query.docs[0] && "details_user" in query.docs[0].data())) {
  //   return res.send({ message: "No existe el numero de cuenta" });
  // }

  // return res.send({ message: "Si existe el numero de cuenta" });

  // try {
  //   const buscar_cuenta_receptora = (
  //     await database
  //       .collection("users")
  //       .where("details_user.nrocuenta", "==", cuentareceptora)
  //       .limit(1)
  //       .get()
  //   ).docs[0].data();
  //   if (buscar_cuenta_receptora == "undefined") {
  //     return res.send({ message: "No existe la cuenta receptora" });
  //   }
  //   return res.send({ data: buscar_cuenta_receptora });
  // } catch (error) {
  //   return res.send({ message: error.message });
  // }
});

// routes.post("/sendemailprueba", async (req, res) => {
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

// routes.post("/signup2", async (req, res) => {
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
export default routes;
