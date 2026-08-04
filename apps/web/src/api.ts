import type { Prediction } from "@probli/shared";

const API_URL = import.meta.env.VITE_API_URL;

export async function getPredictions(): Promise<Prediction[]> {
  const res = await fetch(`${API_URL}/predictions`);
  if (!res.ok) throw new Error("Error al cargar las predicciones");
  return res.json();
}

export async function createPrediction(statement: string, confidence: number) {
  const res = await fetch(`${API_URL}/predictions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statement, confidence }),
  });
  if (!res.ok) throw new Error("Error al crear la predicción");
  return res.json();
}