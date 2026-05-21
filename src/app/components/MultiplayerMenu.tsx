import { motion } from 'motion/react';
import { Monitor, Wifi } from 'lucide-react';

interface MultiplayerMenuProps {
  mode: 'coop' | 'pvp';
  onSelectType: (type: 'local' | 'online') => void;
  onBack: () => void;
}

export function MultiplayerMenu({ mode, onSelectType, onBack }: MultiplayerMenuProps) {
  const modeTitle = mode === 'coop' ? 'Co-op' : 'PVP';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
      </div>

      {/* Menu content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center"
        >
          <h1 
            className="text-6xl font-black text-white uppercase tracking-wider mb-4"
            style={{
              textShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              WebkitTextStroke: '2px #FF6B35',
            }}
          >
            {modeTitle} Mode
          </h1>
          <p 
            className="text-2xl font-bold text-[#FF8C42] uppercase tracking-wide"
            style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
          >
            Choose Play Type
          </p>
        </motion.div>

        {/* Type Selection Buttons */}
        <div className="flex gap-8">
          {/* Local Button */}
          <motion.button
            className="bg-[#FF6B35] rounded-3xl p-12 flex flex-col items-center gap-6 relative group"
            style={{
              border: '8px solid black',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
              width: '320px',
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => onSelectType('local')}
          >
            <div 
              className="w-28 h-28 rounded-full bg-white flex items-center justify-center"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
            >
              <Monitor className="w-16 h-16 text-[#FF6B35]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 
                className="text-white font-black text-3xl uppercase tracking-wide mb-2"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Local
              </h2>
              <p 
                className="text-white font-bold text-sm"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Pass & play on same device
              </p>
            </div>
          </motion.button>

          {/* Online Button */}
          <motion.button
            className="bg-[#6B7280] rounded-3xl p-12 flex flex-col items-center gap-6 relative group"
            style={{
              border: '8px solid black',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
              width: '320px',
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => onSelectType('online')}
          >
            <div 
              className="w-28 h-28 rounded-full bg-white flex items-center justify-center"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
            >
              <Wifi className="w-16 h-16 text-[#6B7280]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 
                className="text-white font-black text-3xl uppercase tracking-wide mb-2"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Online
              </h2>
              <p 
                className="text-white font-bold text-sm"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Play with a friend online via room code
              </p>
            </div>
          </motion.button>
        </div>

        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="bg-[#374151] text-white py-4 px-12 rounded-xl font-black text-xl uppercase mt-4"
          style={{
            border: '6px solid black',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
      </div>
    </div>
  );
}
