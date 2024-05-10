import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Session = sequelize.define("Session", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
});

export function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
  };
}

export default Session;
