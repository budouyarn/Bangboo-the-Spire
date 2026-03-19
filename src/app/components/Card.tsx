import { motion } from 'motion/react';
import { Sword, Shield, Heart, Zap } from 'lucide-react';

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
  // Calculate fan spread
  const spreadAngle = 20; // degrees
  const rotation = ((index - (totalCards - 1) / 2) * spreadAngle) / Math.max(totalCards - 1, 1);
  const verticalOffset = Math.abs(rotation) * 2;

  const getCardColor = () => {
    switch (card.type) {
      case 'attack':
        return 'bg-[#E63946]';
      case 'defend':
        return 'bg-[#457B9D]';
      case 'skill':
        return 'bg-[#F72585]';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'attack':
        return <Sword className="w-6 h-6" />;
      case 'defend':
        return <Shield className="w-6 h-6" />;
      case 'skill':
        return <Zap className="w-6 h-6" />;
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
    >
      <div
        className={`w-36 h-52 ${getCardColor()} rounded-lg shadow-2xl flex flex-col overflow-hidden ${
          !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          border: '6px solid black',
          boxShadow: '8px 8px 0px rgba(0,0,0,0.8)',
        }}
      >
        {/* Checkered pattern border top */}
        <div className="h-3 flex">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
        
        <div className="flex-1 flex flex-col p-3 relative">
          {/* Cost badge */}
          <div className="absolute -top-1 -left-1 bg-white border-4 border-black rounded-full w-12 h-12 flex items-center justify-center font-black text-2xl shadow-lg">
            {card.cost}
          </div>
          
          {/* Icon */}
          <div className="absolute -top-1 -right-1 bg-black border-4 border-white rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg">
            {getCardIcon()}
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center mt-8">
            <h3 className="text-white font-black text-lg mb-3 uppercase tracking-tight leading-tight" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}>
              {card.name}
            </h3>
            
            <div className="bg-black border-4 border-white rounded-lg px-4 py-2 mb-3">
              <p className="text-white font-black text-3xl">{card.value}</p>
            </div>
            
            <p className="text-white font-bold text-xs uppercase bg-black/40 px-2 py-1 rounded">
              {card.description}
            </p>
          </div>
        </div>

        {/* Checkered pattern border bottom */}
        <div className="h-3 flex">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}