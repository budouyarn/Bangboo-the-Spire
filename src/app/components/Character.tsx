import { motion } from 'motion/react';
import { Heart, Shield } from 'lucide-react';

// Import character images
import playerAvatar from 'figma:asset/0aeea4921f1215c52fce980d72dfd5ac956ab8c8.png';
import enemyAvatar from 'figma:asset/1d6f9f81f46b21ef69c2cb07ef388ecc1d94573b.png';

export interface CharacterData {
  name: string;
  hp: number;
  maxHp: number;
  block: number;
}

interface CharacterProps {
  character: CharacterData;
  isEnemy?: boolean;
  isActive?: boolean;
  isShielding?: boolean;
}

export function Character({ character, isEnemy = false, isActive = false, isShielding = false }: CharacterProps) {
  const hpPercentage = (character.hp / character.maxHp) * 100;

  return (
    <motion.div
      className="relative flex flex-col items-center gap-3"
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        rotate: isActive ? [0, -2, 2, -2, 2, 0] : 0,
      }}
      transition={{ 
        scale: { type: 'spring', stiffness: 200 },
        rotate: { duration: 0.5, ease: 'easeInOut' }
      }}
    >
      {/* Shield Animation Overlay */}
      {isShielding && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-[#457B9D] rounded-full p-8 border-6 border-white shadow-2xl" style={{
            boxShadow: '0 0 30px rgba(69, 123, 157, 0.8), 0 0 60px rgba(69, 123, 157, 0.4)',
          }}>
            <Shield className="w-24 h-24 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      )}

      {/* HP Bar */}
      <div className="bg-white/90 rounded-lg p-2 shadow-lg w-48" style={{
        border: '3px solid black',
        boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
      }}>
        {/* HP Label with Heart */}
        <div className="flex items-center gap-1 mb-1">
          <Heart className="w-4 h-4 fill-[#E63946] text-[#E63946]" />
          <span className="text-black font-black text-xs uppercase tracking-wide">HP</span>
          <span className="text-black font-bold text-xs ml-auto">{character.hp} / {character.maxHp}</span>
        </div>
        
        <div className="w-full h-4 bg-black rounded-md overflow-hidden border-2 border-black">
          <motion.div
            className="h-full bg-[#E63946] relative overflow-hidden"
            initial={{ width: '100%' }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.5 }}
          >
            {/* Diagonal stripes */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 12px)'
            }} />
          </motion.div>
        </div>
      </div>

      {/* Character Avatar with Animation */}
      <motion.div
        className="relative"
        animate={
          isActive 
            ? {
                y: [0, -10, 0],
                rotate: [0, -5, 5, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        <div className="w-48 h-48 flex items-center justify-center">
          <img 
            src={isEnemy ? enemyAvatar : playerAvatar} 
            alt={isEnemy ? 'Enemy' : 'Player'} 
            className="w-full h-full object-contain"
          />
        </div>
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-2 -right-2 bg-[#F72585] border-4 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            style={{
              boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className="text-white font-black text-xl">!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Block */}
      {character.block > 0 && (
        <motion.div
          className="flex items-center gap-2 bg-white rounded-lg p-2 border-3 border-black shadow-lg"
          style={{
            boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="bg-[#457B9D] rounded-full p-1.5 border-2 border-black">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-black font-black text-base">Block: {character.block}</span>
        </motion.div>
      )}
    </motion.div>
  );
}