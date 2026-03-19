import { Layers, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface DeckInfoProps {
  deckSize: number;
  discardSize: number;
}

export function DeckInfo({ deckSize, discardSize }: DeckInfoProps) {
  const [showDeckLabel, setShowDeckLabel] = useState(false);
  const [showDiscardLabel, setShowDiscardLabel] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Deck */}
      <div className="relative">
        <motion.div
          className="bg-[#F72585] rounded-full w-24 h-24 shadow-2xl cursor-pointer flex items-center justify-center relative"
          style={{
            border: '6px solid black',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          onHoverStart={() => setShowDeckLabel(true)}
          onHoverEnd={() => setShowDeckLabel(false)}
        >
          <div className="flex flex-col items-center">
            <Layers className="w-8 h-8 text-white mb-1" />
            <span className="text-white font-black text-2xl">{deckSize}</span>
          </div>
        </motion.div>

        {/* Tooltip */}
        {showDeckLabel && (
          <motion.div
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black rounded-lg px-4 py-2 whitespace-nowrap z-50"
            style={{
              border: '3px solid white',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-white font-black uppercase text-sm">Deck</span>
          </motion.div>
        )}
      </div>

      {/* Discard Pile */}
      <div className="relative">
        <motion.div
          className="bg-[#2A2A2A] rounded-full w-24 h-24 shadow-2xl cursor-pointer flex items-center justify-center relative"
          style={{
            border: '6px solid black',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
          }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          onHoverStart={() => setShowDiscardLabel(true)}
          onHoverEnd={() => setShowDiscardLabel(false)}
        >
          <div className="flex flex-col items-center">
            <Trash2 className="w-8 h-8 text-white mb-1" />
            <span className="text-white font-black text-2xl">{discardSize}</span>
          </div>
        </motion.div>

        {/* Tooltip */}
        {showDiscardLabel && (
          <motion.div
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black rounded-lg px-4 py-2 whitespace-nowrap z-50"
            style={{
              border: '3px solid white',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-white font-black uppercase text-sm">Discard</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}