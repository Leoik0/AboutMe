const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();
const port = 5000;

// Configuração do multer para o upload de arquivos
const upload = multer({ dest: "uploads/" });

// Configuração do Sequelize para conexão com o SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

// Definição do modelo User
const User = sequelize.define("User", {
  name: DataTypes.STRING,
  photo: DataTypes.STRING,
  points: DataTypes.INTEGER,
});

// Sincronização do banco de dados
sequelize.sync().then(() => {
  console.log("Database synchronized");
});

// Configuração do CORS para permitir todas as origens
app.use(cors());

// Configuração para analisar o corpo das requisições como JSON
app.use(express.json());

// Configuração para servir arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint para adicionar um usuário com foto
app.post("/api/users", upload.single("photo"), async (req, res) => {
  try {
    const { name } = req.body;
    const photoPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const user = await User.create({
      name,
      photo: photoPath,
      points: 0, // Default points
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para atualizar os pontos de um usuário
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

// Endpoint para obter usuários
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

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
