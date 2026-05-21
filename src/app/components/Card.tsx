import { motion } from 'motion/react';
import { Sword, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

export type CardType = 'attack' | 'defend' | 'skill';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  value: number;
  description: string;
}

interface CardProps {
  card: Card;
  index: number;
  totalCards: number;
  onPlay: (card: Card) => void;
  isPlayerTurn: boolean;
}

export function Card({ card, index, totalCards, onPlay, isPlayerTurn }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate fan spread
  const spreadAngle = 20; // degrees
  const rotation = ((index - (totalCards - 1) / 2) * spreadAngle) / Math.max(totalCards - 1, 1);
  const verticalOffset = Math.abs(rotation) * 2;

  const getBannerColor = () => {
    switch (card.type) {
      case 'attack':
        return 'bg-[#FF6B35]';
      case 'defend':
        return 'bg-[#6B7280]';
      case 'skill':
        return 'bg-[#5DADE2]';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'attack':
        return <Sword className="w-20 h-20 text-white" strokeWidth={2} />;
      case 'defend':
        return <Shield className="w-20 h-20 text-white" strokeWidth={2} />;
      case 'skill':
        return <Zap className="w-20 h-20 text-white" strokeWidth={2} />;
    }
  };

  const getCardTypeLabel = () => {
    switch (card.type) {
      case 'attack':
        return 'Power';
      case 'defend':
        return 'Defense';
      case 'skill':
        return 'Skill';
    }
  };

  return (
    <motion.div
      className={`absolute cursor-pointer select-none`}
      style={{
        left: `${index * 80}px`,
        transformOrigin: 'bottom center',
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: verticalOffset,
        rotate: rotation,
        opacity: 1,
      }}
      whileHover={
        isPlayerTurn
          ? {
              y: -40,
              rotate: 0,
              scale: 1.1,
              zIndex: 50,
            }
          : {}
      }
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => isPlayerTurn && onPlay(card)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Description Popup */}
      {isHovered && isPlayerTurn && (
        <motion.div
          className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className={`${getBannerColor()} rounded-xl px-6 py-4 min-w-[280px] max-w-[320px]`}
            style={{
              border: '5px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2)',
            }}
          >
            <h4 
              className="text-white font-black text-lg uppercase tracking-wide text-center mb-2"
              style={{ 
                textShadow: '2px 2px 3px rgba(0,0,0,0.8)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
              }}
            >
              {card.name}
            </h4>
            <div className="bg-black/40 rounded-lg px-4 py-2 border-2 border-white/20">
              <p 
                className="text-white font-bold text-sm text-center leading-relaxed"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                {card.description}
              </p>
            </div>
            <div className="mt-2 flex justify-center items-center gap-2">
              <span 
                className="text-white font-black text-xs uppercase tracking-wide"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Cost:
              </span>
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  border: '2px solid black',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.6)',
                }}
              >
                <span className="text-white font-black text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  {card.cost}
                </span>
              </div>
            </div>
            {/* Arrow pointing down */}
            <div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rotate-45"
              style={{
                backgroundColor: card.type === 'attack' ? '#FF6B35' : card.type === 'defend' ? '#6B7280' : '#5DADE2',
                border: '5px solid black',
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </div>
        </motion.div>
      )}

      <div
        className={`w-40 h-64 bg-gradient-to-b from-[#8B4513] to-[#A0522D] rounded-3xl shadow-2xl flex flex-col relative ${
          !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          border: '8px solid #8B2500',
          boxShadow: '0 8px 16px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
        }}
      >
        {/* Ornamental top curve */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#8B2500] rounded-t-full" />
        
        {/* Cost Badge */}
        <div 
          className="absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: '3px solid #8B4513',
            boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.3)',
          }}
        >
          <span className="text-white font-black text-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {card.cost}
          </span>
        </div>

        {/* Card Name Banner */}
        <div 
          className={`${getBannerColor()} mx-3 mt-4 px-3 py-2 rounded-lg relative`}
          style={{
            border: '3px solid rgba(255,255,255,0.3)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          <h3 
            className="text-white font-black text-sm uppercase tracking-tight text-center leading-tight"
            style={{ 
              textShadow: '2px 2px 3px rgba(0,0,0,0.8)',
              WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
            }}
          >
            {card.name}
          </h3>
        </div>

        {/* Circular Image/Icon Container */}
        <div className="flex justify-center mt-4">
          <div 
            className="w-28 h-28 rounded-full bg-gradient-to-br from-black via-[#1a1a1a] to-black flex items-center justify-center relative overflow-hidden"
            style={{
              border: `5px solid ${card.type === 'attack' ? '#FF6B35' : card.type === 'defend' ? '#6B7280' : '#5DADE2'}`,
              boxShadow: `0 4px 8px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.1)`,
            }}
          >
            {getCardIcon()}
            {/* Shine effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
              style={{ borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* Card Type Label */}
        <div className="flex justify-center mt-3">
          <span 
            className="text-white font-black text-sm uppercase tracking-wide"
            style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.8)' }}
          >
            {getCardTypeLabel()}
          </span>
        </div>

        {/* Ornamental bottom curve */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-[#8B2500] rounded-b-full" />
      </div>
    </motion.div>
  );
}