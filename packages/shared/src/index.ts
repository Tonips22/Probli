import { z } from "zod";

// La "forma" de una predicción nueva
export const createPredictionSchema = z.object({
  statement: z.string().min(3, "La frase no puede estar vacía"),
  confidence: z.number().int().min(1).max(100),
});
export type CreatePredictionInput = z.infer<typeof createPredictionSchema>;

// La "forma" al resolver una predicción
export const resolvePredictionSchema = z.object({
  correct: z.boolean(),
});
export type ResolvePredictionInput = z.infer<typeof resolvePredictionSchema>;