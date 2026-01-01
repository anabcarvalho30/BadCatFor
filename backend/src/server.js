import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import contentRoutes from "./routes/content.routes.js";
import supportRoutes from "./routes/support.routes.js";

const app = express();

// Middlewares
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

// Rota de teste (opcional)
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
