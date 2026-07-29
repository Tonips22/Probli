import express from "express";
import { prisma } from "./db.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Listar todas las predicciones
app.get("/predictions", async (req, res) => {
  const predictions = await prisma.prediction.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(predictions);
});

// Crear una predicción
app.post("/predictions", async (req, res) => {
  const { statement, confidence } = req.body;

  if (!statement || typeof confidence !== "number") {
    return res.status(400).json({ error: "Faltan datos o son inválidos" });
  }

  const prediction = await prisma.prediction.create({
    data: { statement, confidence },
  });
  res.status(201).json(prediction);
});

const PORT = 4321;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});