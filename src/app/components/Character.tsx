import { motion } from 'motion/react';
import { Heart, Shield, Swords } from 'lucide-react';

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
  isAttacking?: boolean;
}

export function Character({ character, isEnemy = false, isActive = false, isShielding = false, isAttacking = false }: CharacterProps) {
  const hpPercentage = (character.hp / character.maxHp) * 100;

  return (
    <motion.div
      className="relative flex flex-col items-center gap-3"
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        rotate: isActive ? [0, -2, 2, -2, 2, 0] : 0,
        x: isAttacking ? [0, -8, 6, -4, 8, -6, 4, -2, 0] : 0,
        y: isAttacking ? [0, 4, -6, 2, -4, 6, -2, 4, 0] : 0,
      }}
      transition={{ 
        scale: { type: 'spring', stiffness: 200 },
        rotate: { duration: 0.5, ease: 'easeInOut' },
        x: { duration: 0.6, ease: 'linear' },
        y: { duration: 0.6, ease: 'linear' }
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
          <div className="bg-[#6B7280] rounded-full p-8 border-6 border-white shadow-2xl" style={{
            boxShadow: '0 0 30px rgba(107, 114, 128, 0.8), 0 0 60px rgba(107, 114, 128, 0.4)',
          }}>
            <Shield className="w-24 h-24 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      )}

      {/* Attack Animation Overlay */}
      {isAttacking && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
          animate={{ 
            scale: [0.3, 1.2, 1], 
            opacity: [0, 1, 0],
            rotate: [-45, 0, 45]
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="bg-[#FF6B35] rounded-full p-8 border-6 border-white shadow-2xl" style={{
              boxShadow: '0 0 30px rgba(255, 107, 53, 0.8), 0 0 60px rgba(255, 107, 53, 0.4)',
            }}>
              <Swords className="w-24 h-24 text-white" strokeWidth={3} />
            </div>
            {/* Comic-style impact lines */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white"
                style={{
                  width: '4px',
                  height: '40px',
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'center',
                  transform: `rotate(${i * 45}deg) translateY(-80px)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            ))}
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
          <Heart className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
          <span className="text-black font-black text-xs uppercase tracking-wide">HP</span>
          <span className="text-black font-bold text-xs ml-auto">{character.hp} / {character.maxHp}</span>
        </div>
        
        <div className="w-full h-4 bg-black rounded-md overflow-hidden border-2 border-black">
          <motion.div
            className="h-full bg-[#FF6B35] relative overflow-hidden"
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
            : isAttacking
            ? {
                filter: [
                  'hue-rotate(0deg) saturate(100%)',
                  'hue-rotate(90deg) saturate(200%)',
                  'hue-rotate(0deg) saturate(100%)',
                  'hue-rotate(-90deg) saturate(200%)',
                  'hue-rotate(0deg) saturate(100%)',
                ],
                opacity: [1, 0.8, 1, 0.7, 1, 0.9, 1],
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
            className="absolute -top-2 -right-2 bg-[#FF8C42] border-4 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
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
          <div className="bg-[#6B7280] rounded-full p-1.5 border-2 border-black">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-black font-black text-base">Block: {character.block}</span>
        </motion.div>
      )}
    </motion.div>
  );
}