const express = require("express");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const AWS = require("aws-sdk");

const app = express();
const port = process.env.PORT || 5000;

// Configuração do AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Coloque sua chave de acesso
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Coloque sua chave secreta
});

// Configuração do multer para o upload de arquivos para o S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME, // Nome do seu bucket S3
    acl: "public-read", // Permissões de leitura pública
    key: (req, file, cb) => {
      cb(null, `users/${Date.now().toString()}_${file.originalname}`); // Define o caminho do arquivo no bucket
    },
  }),
});

// Configuração do Sequelize para conexão com o RDS (PostgreSQL ou MySQL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // ou 'mysql'
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

// Endpoint para adicionar um usuário com foto
app.post("/api/users", upload.single("photo"), async (req, res) => {
  try {
    const { name } = req.body;
    const photoUrl = req.file ? req.file.location : ""; // URL da foto no S3

    const user = await User.create({
      name,
      photo: photoUrl,
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
