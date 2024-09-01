// backend/models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = User;
