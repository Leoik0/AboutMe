// backend/models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = User;
