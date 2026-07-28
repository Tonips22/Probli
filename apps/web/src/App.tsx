import { motion } from "motion/react";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold font-primary text-white"
      >
        Predicciones
      </motion.h1>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-primary px-6 py-3 font-medium shadow-lg cursor-pointer hover:bg-primary-hover transition-colors duration-200 text-white"
      >
        Hazme clic
      </motion.button>
    </div>
  );
}

export default App;