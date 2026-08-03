import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import {
  createPredictionSchema,
  resolvePredictionSchema,
} from "@probli/shared";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Cambia esto según tu configuración
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
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
  const result = createPredictionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const prediction = await prisma.prediction.create({ data: result.data });
  res.status(201).json(prediction);
});

// Resolver una predicción (¿acertaste?)
app.patch("/predictions/:id/resolve", async (req, res) => {
  const result = resolvePredictionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const existing = await prisma.prediction.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    return res.status(404).json({ error: "Predicción no encontrada" });
  }

  const prediction = await prisma.prediction.update({
    where: { id: req.params.id },
    data: { resolved: true, correct: result.data.correct },
  });
  res.json(prediction);
});

// Borrar una predicción
app.delete("/predictions/:id", async (req, res) => {
  const existing = await prisma.prediction.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    return res.status(404).json({ error: "Predicción no encontrada" });
  }

  await prisma.prediction.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});