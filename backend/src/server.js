import 'dotenv/config';
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import contentRoutes from "./routes/content.routes.js";
import supportRoutes from "./routes/support.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/games", contentRoutes);
app.use("/support", supportRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.send("Servidor rodando! API pronta.");
});

const PORT = process.env.PORT || 3000;

// O servidor inicia aqui
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Pressione CTRL + C para parar o servidor`);
});