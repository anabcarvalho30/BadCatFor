import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
  res.send("Servidor rodando! API pronta.");
});

// Exemplo de rota de usuários
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
