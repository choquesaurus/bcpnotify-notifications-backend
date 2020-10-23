"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.database = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var _process$env = process.env,
    firebase_database_url = _process$env.firebase_database_url,
    type_cert = _process$env.type_cert,
    project_id_cert = _process$env.project_id_cert,
    private_key_id_cert = _process$env.private_key_id_cert,
    private_key_cert = _process$env.private_key_cert,
    client_email_cert = _process$env.client_email_cert,
    client_id_cert = _process$env.client_id_cert,
    auth_uri_cert = _process$env.auth_uri_cert,
    token_uri_cert = _process$env.token_uri_cert,
    auth_provider_x509_cert_url = _process$env.auth_provider_x509_cert_url,
    client_x509_cert_url = _process$env.client_x509_cert_url;

var admin = _firebaseAdmin["default"].initializeApp({
  credential: _firebaseAdmin["default"].credential.cert({
    type: type_cert,
    project_id: project_id_cert,
    private_key_id: private_key_id_cert,
    private_key: private_key_cert,
    client_email: client_email_cert,
    client_id: client_id_cert,
    auth_uri: auth_uri_cert,
    token_uri: token_uri_cert,
    auth_provider_x509_cert_url: auth_provider_x509_cert_url,
    client_x509_cert_url: client_x509_cert_url
  }),
  databaseURL: firebase_database_url
}); // const var={
//   type: "service_account",
//   project_id: "notifications-examples",
//   private_key_id: "3f92ab3320de4b37623b93fed3383445b58aa73d",
//   private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD0RbJwGElMYKzX\n1btuh1JHR7g3XDv7qtb7QxDi5XWpBKpbYn2Yw3lVNt9wLd2fvuQuon9FlYezvTUh\nYS717sXs1Iab1+wNuXK/IfSbOqaRuoypOosS9GU+V7ziR1f5vzIAm9wLuc/XZB39\nlVWr+9Bhu1G5zop/kxBM7kRldpN7XuEdplP/OF8MMV+MU2eonZyvaiTA8NHKTmIj\ngeXPFi8Uq0NiWsJm/K3QmtWiTqD9XWDxHU+E26AYCMlxLa9gPYx5Al9xyuTkVAKN\nT+HdQU0wpKzB33EjUnNfvXKNYe5ms7x9wdlReBHHYH91ITzH9RBrmbYSbEoEZK8Z\n2DUHKjRjAgMBAAECggEAFv+68b/vos/VZkr650i5b/mqOBgok6T9sdGaNOrK3buR\nOKJ41dnNwj604fCHleNYw6VMG2adTMiLSJXIYKJ3IznNZL37PT2RNrrBN55ZkY4B\ncWuQLZwyLiD/qURzXZHpaNJD8RyxG4QTKM2XL+a5M4J6CucN9j4IAl5KtUzpTOuu\najPeqZh482ctohkL6y3n5jkKPjA9Ukzb1q68MM1ON0t34APREHa8lvGKEV+8EE1w\noy8dmY1jGdCZV7k8uBQ75lTWg/jKez93YwaK3YzwUl8kFaYKDBWBOAwyiJ96ElgP\n6fDiaiY0/EkPTiNI9WoLgQI6EJqfddiXHrAhhkxWWQKBgQD7fA2xmC6MesKnF4gI\nOFVD49sfybwo3QMoMCgGWgZGTcIXbAuwWBKjNZM3aeNPhepf3blj+GZydcHV+dJV\nXwDo+MjiI/YNvJaB4VcmJ69jWJ9pnBpq3Vk75reZoRz+4XbYLbHhpyLvddZtWwTG\nSoNxOaGJj90w5S6LI/8sV+BT2QKBgQD4qH377zdad19zmIykhuvjYSp5ro+5mnTF\nQ8BPs2XJwsEhB+RHIVKBW1HsDhGFSIF3FRn/ef8JHcce7pbY7GQoF8pEaViGQKfh\nxiyOUV1P8/bOPm3PJtsFlOKkQv+53Q/TUsnGtVz9ijr9yRpH3sts6Ou0KT+1bZ8F\n2XW0GBzwmwKBgQDVJW2NykgZtKpqaJ1ZKjXKVsMQDDG4CKp2U2p5B7AtwhXxOBgo\nHF2fivb9jneknQHqwsgwnQZnmLrzGsxUozLoQoQwdv5C4kZGSrFMm3Ihp6llH3Oc\ng4LwLDoMsesbdAkAbKpJcRlBEATvpqdDUUBapNfu+colePmb4KST9t8g8QKBgQD3\nQRvdOzZQd6jrWgJny12eAM1qp8B0r3hzevYsileps0W1YZKFhEX1KOgiEK8tWDac\nQdhTKG0IFJseT+KhmxXQpC9VrWcAQCRvpU5Cyfc+fHmrBXrNZHafazeeXJzKpV2K\nJaVMOKVZ22zjVGgUlR60kjtmLyoRbwqUl3Kp/NwyBwKBgCgk4WKmJad6FuUUwdhm\npKeAmAl17TrWZzhjI5G0H1gnXZ+dFNABgb1ndZFbBC+p3iMJ8yjeuR8pm73ww/fO\nDWptwNF1QrCrfsvpDK57xn76OlKfxI7U/WROzROv0/hVxlb7AI4k1fkPX8Dfm4yq\npPgSwqeJZOY4L30V/5mPPuUC\n-----END PRIVATE KEY-----\n",
//   client_email: "firebase-adminsdk-pt6ik@notifications-examples.iam.gserviceaccount.com",
//   client_id: "117135034950682015189",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pt6ik%40notifications-examples.iam.gserviceaccount.com"
// }
// console.log(
//   Object.assign(JSON.parse(serviceAccount_join_one), { private_key })
// );
//console.log(JSON.parse(serviceAccount_join_two_private_key.toString()));
//const admin = firebaseAdmin.initializeApp(JSON.parse(firebase_adminsdk));
//const admin = firebaseAdmin.initializeApp(admin_initial);


var database = admin.firestore();
exports.database = database;