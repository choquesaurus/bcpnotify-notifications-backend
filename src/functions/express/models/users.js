import sequalize from "sequelize";
import ConnectionSequalize from "../connection/index";

const ModelUser = ConnectionSequalize.define(
  "users",
  {
    iduser: {
      type: sequalize.TEXT,
      primaryKey: true,
    },
    email: sequalize.TEXT,
    password: sequalize.TEXT,
  },
  {
    timestamps: false,
  }
);
export default ModelUser;
