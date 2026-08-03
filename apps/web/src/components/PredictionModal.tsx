import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Prediction } from "@probli/shared";

type Props = {
  prediction: Prediction | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeStyle: "short",
});

function getStatus(p: Prediction) {
  if (!p.resolved) {
    return { label: "Pendiente", className: "bg-warning/15 text-warning" };
  }
  if (p.correct) {
    return { label: "Acertada", className: "bg-success/15 text-success" };
  }
  return { label: "Fallada", className: "bg-danger/15 text-danger" };
}

function PredictionModal({ prediction, onClose }: Props) {
  useEffect(() => {
    if (!prediction) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [prediction, onClose]);

  return (
    <AnimatePresence>
      {prediction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={prediction.statement}
            layoutId={`prediction-${prediction.id}`}
            onClick={(e) => { e.stopPropagation(); }}
            // transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ borderRadius: 16 }}
            className="w-full max-w-lg bg-card border border-text/10 p-8 shadow-2xl"
          >
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start justify-between gap-4"
            >
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${getStatus(prediction).className}`}
              >
                {getStatus(prediction).label}
              </span>
              <motion.button
                onClick={onClose}
                aria-label="Cerrar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-text-muted hover:text-text cursor-pointer text-2xl leading-none"
              >
                x
              </motion.button>
            </motion.div>

            <motion.h2
              layout="position"
              layoutId={`prediction-statement-${prediction.id}`}
              className="font-primary text-3xl font-bold mt-6"
            >
              {prediction.statement}
            </motion.h2>

            <div className="mt-8">
              <div className="flex justify-between items-baseline">
                <motion.span
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-text-secondary"
                >
                  Confianza
                </motion.span>
                <motion.span
                  layout="position"
                  layoutId={`prediction-confidence-${prediction.id}`}
                  className="text-2xl font-bold text-primary"
                >
                  {prediction.confidence}%
                </motion.span>
              </div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // transition={{ duration: 0.15, delay: 0.15 }}
                className="mt-2 h-2 w-full bg-surface rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </motion.div>
            </div>

            <motion.dl
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="mt-8 grid grid-cols-1 gap-4 text-sm"
            >
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">Creada</dt>
                <dd>{dateFormatter.format(new Date(prediction.createdAt))}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">Resultado</dt>
                <dd>
                  {prediction.resolved
                    ? prediction.correct
                      ? "Ocurrió"
                      : "No ocurrió"
                    : "Sin resolver"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">ID</dt>
                <div className="text-text-muted font-mono flex gap-2 text-xs self-center">
                  <dd>
                    {prediction.id}
                  </dd>
                  <span className="text-text-muted text-xs hover:text-text cursor-pointer" onClick={() => navigator.clipboard.writeText(prediction.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-copy-icon lucide-copy size-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </span>

                </div>
              </div>
            </motion.dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PredictionModal;
