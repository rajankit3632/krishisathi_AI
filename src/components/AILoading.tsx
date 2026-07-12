import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MESSAGES = [
  "Reading dataset...",
  "Understanding column schema and structures...",
  "Running descriptive statistical calculations...",
  "Finding hidden correlations and distribution shapes...",
  "Generating multilingual intelligence reports...",
  "Reviewing policy implications & recommendations...",
  "Sanitizing calculations to eliminate hallucinations...",
  "Finalizing response insights..."
];

export default function AILoading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[350px] glass-panel shadow-lg shadow-indigo-950/20">
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border-t-2 border-r-2 border-emerald-400/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute w-20 h-20 rounded-full border-b-2 border-l-2 border-indigo-400/40"
        />
        <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-indigo-950/20">
          <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center h-16 max-w-sm flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center gap-2 text-indigo-300 font-medium tracking-wide font-display">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Gemma Analytical Mind</span>
            </div>
            <p className="text-sm text-slate-400 font-light">
              {MESSAGES[msgIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
