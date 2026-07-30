import { describe, it, expect } from "vitest";
import { createPredictionSchema } from "./index.js";
import { resolvePredictionSchema } from "./index.js";

describe("createPredictionSchema", () => {
  it("acepta una predicción válida", () => {
    const result = createPredictionSchema.safeParse({
      statement: "Apruebo el TFG antes de septiembre",
      confidence: 80,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza una confianza fuera del rango 1-100", () => {
    const result = createPredictionSchema.safeParse({
      statement: "Test",
      confidence: 500,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza una frase vacía", () => {
    const result = createPredictionSchema.safeParse({
      statement: "",
      confidence: 50,
    });
    expect(result.success).toBe(false);
  });
});

describe("resolvePredictionSchema", () => {
  it("acepta correct: true", () => {
    expect(resolvePredictionSchema.safeParse({ correct: true }).success).toBe(true);
  });

  it("rechaza un correct que no es booleano", () => {
    expect(resolvePredictionSchema.safeParse({ correct: "sí" }).success).toBe(false);
  });
});
