import { motion } from 'motion/react';
import { User, Users, Swords } from 'lucide-react';

interface GameModeMenuProps {
  onSelectMode: (mode: 'single' | 'coop' | 'pvp') => void;
}

export function GameModeMenu({ onSelectMode }: GameModeMenuProps) {
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
            className="text-7xl font-black text-white uppercase tracking-wider mb-4"
            style={{
              textShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              WebkitTextStroke: '2px #FF6B35',
            }}
          >
            Battle Rogue
          </h1>
          <p 
            className="text-2xl font-bold text-[#FF8C42] uppercase tracking-wide"
            style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
          >
            Choose Your Mode
          </p>
        </motion.div>

        {/* Mode Selection Buttons */}
        <div className="flex gap-8">
          {/* Single Player Button */}
          <motion.button
            className="bg-[#FF6B35] rounded-3xl p-10 flex flex-col items-center gap-6 relative group"
            style={{
              border: '8px solid black',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
              width: '280px',
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => onSelectMode('single')}
          >
            <div 
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
            >
              <User className="w-14 h-14 text-[#FF6B35]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 
                className="text-white font-black text-3xl uppercase tracking-wide mb-2"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Single Player
              </h2>
              <p 
                className="text-white font-bold text-sm"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Face the enemy alone
              </p>
            </div>
          </motion.button>

          {/* Co-op Button */}
          <motion.button
            className="bg-[#6B7280] rounded-3xl p-10 flex flex-col items-center gap-6 relative group"
            style={{
              border: '8px solid black',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
              width: '280px',
            }}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => onSelectMode('coop')}
          >
            <div 
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
            >
              <Users className="w-14 h-14 text-[#6B7280]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 
                className="text-white font-black text-3xl uppercase tracking-wide mb-2"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Co-op
              </h2>
              <p 
                className="text-white font-bold text-sm"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Team up with a friend
              </p>
            </div>
          </motion.button>

          {/* PVP Button */}
          <motion.button
            className="bg-[#FF8C42] rounded-3xl p-10 flex flex-col items-center gap-6 relative group"
            style={{
              border: '8px solid black',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
              width: '280px',
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => onSelectMode('pvp')}
          >
            <div 
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
            >
              <Swords className="w-14 h-14 text-[#FF8C42]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 
                className="text-white font-black text-3xl uppercase tracking-wide mb-2"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                PVP
              </h2>
              <p 
                className="text-white font-bold text-sm"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Battle against a friend
              </p>
            </div>
          </motion.button>
        </div>

        {/* Info text */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p 
            className="text-white font-bold text-lg mb-2"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}
          >
            Co-op: Team up to defeat the enemy together
          </p>
          <p 
            className="text-white font-bold text-lg"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}
          >
            PVP: Battle head-to-head with a friend
          </p>
        </motion.div>
      </div>
    </div>
  );
}