const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const upload = multer({ dest: "uploads/" });
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  photo: DataTypes.STRING,
  points: DataTypes.INTEGER,
});

sequelize.sync().then(() => console.log("Database synchronized"));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/users", upload.single("photo"), async (req, res) => {
  try {
    const { name } = req.body;
    const photoPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const user = await User.create({
      name,
      photo: photoPath,
      points: 0,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.points = points;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["points", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
