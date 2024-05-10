import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GoogleUser = sequelize.define("GoogleUser", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default GoogleUser;
