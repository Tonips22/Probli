import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Prediction } from "@probli/shared";
import { getPredictions, createPrediction } from "./api";
import PredictionModal from "./components/PredictionModal";

function App() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [statement, setStatement] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [selected, setSelected] = useState<Prediction | null>(null);

  useEffect(() => {
    getPredictions().then(setPredictions).catch(console.error);
  }, []);

  async function handleCreate() {
    if (!statement.trim()) return;
    const nueva = await createPrediction(statement, confidence);
    setPredictions([nueva, ...predictions]);
    setStatement("");
    setConfidence(50);
  }

  return (
    <main className="min-h-screen text-text grid grid-cols-1 md:grid-cols-2">
      <section className="bg-primary p-16">
        <h1 className="font-primary text-7xl font-bold text-center">Probli</h1>

        <div className="flex flex-col gap-4 mt-8">
          <input
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="¿Qué va a pasar?"
            className="px-4 py-2 outline-none border-2 bg-primary-active border-text/20 rounded-xl placeholder:text-text-secondary"
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Confianza: {confidence}%</span>
            <input
              type="range"
              min={1}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <motion.button
            onClick={handleCreate}
            className="bg-text/90 text-primary rounded-xl cursor-pointer px-4 py-2 font-bold hover:bg-text transition-all duration-150 ease-in-out active:scale-99"
          >
            Añadir predicción
          </motion.button>

        </div>
      </section>
      <section className="bg-bg px-8 py-16 flex flex-col gap-4 overflow-y-auto">
        <AnimatePresence>
          {predictions.map((p) => (
            <motion.div
              key={p.id}
              layout
              layoutId={`prediction-${p.id}`}
              exit={{ opacity: 0, x: -50 }}
              onClick={() => setSelected(p)}
              style={{ borderRadius: 16 }}
              className=" group bg-card p-4 hover:bg-primary-hover cursor-pointer"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center gap-4"
              >
                <motion.span layout="position" layoutId={`prediction-statement-${p.id}`}>
                  {p.statement}
                </motion.span>
                <motion.span
                  layout="position"
                  layoutId={`prediction-confidence-${p.id}`}
                  className="text-primary font-bold group-hover:text-text-secondary"
                >
                  {p.confidence}%
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <PredictionModal
        prediction={selected}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

export default App;