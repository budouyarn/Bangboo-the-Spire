import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardType } from './components/Card';
import { Character, CharacterData } from './components/Character';
import { ActionStatus } from './components/ActionStatus';

interface CardData {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  value: number;
  description: string;
}

export default function App() {
  const [player, setPlayer] = useState<CharacterData>({
    name: 'Hero',
    hp: 80,
    maxHp: 80,
    block: 0,
  });

  const [enemy, setEnemy] = useState<CharacterData>({
    name: 'Goblin Warrior',
    hp: 50,
    maxHp: 50,
    block: 0,
  });

  const [hand, setHand] = useState<CardData[]>([]);
  const [energy, setEnergy] = useState(3);
  const [maxEnergy] = useState(3);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [currentAction, setCurrentAction] = useState('Battle begins!');
  const [actionType, setActionType] = useState<'player' | 'enemy' | 'system'>('system');
  const [isPlayerShielding, setIsPlayerShielding] = useState(false);
  const [isEnemyShielding, setIsEnemyShielding] = useState(false);

  const addAction = (text: string, type: 'player' | 'enemy' | 'system') => {
    setCurrentAction(text);
    setActionType(type);
  };

  // Initialize hand with starting cards
  useEffect(() => {
    const startingHand: CardData[] = [
      // Starting cards - mix of attack and defend
      { id: '1', name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage' },
      { id: '2', name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage' },
      { id: '3', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '4', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '5', name: 'Power Strike', type: 'attack', cost: 2, value: 12, description: 'Deal 12 damage' },
    ];

    setHand(startingHand);
    addAction('Battle begins! Your turn to play!', 'system');
  }, []);

  const playCard = (card: CardData) => {
    if (!isPlayerTurn || energy < card.cost) {
      addAction('Not enough energy to play that card!', 'system');
      return;
    }

    setEnergy((prev) => prev - card.cost);

    switch (card.type) {
      case 'attack':
        dealDamageToEnemy(card.value);
        addAction(`${card.name}: Dealt ${card.value} damage to enemy!`, 'player');
        break;
      case 'defend':
        setIsPlayerShielding(true);
        setTimeout(() => setIsPlayerShielding(false), 600);
        setPlayer((prev) => ({ ...prev, block: prev.block + card.value }));
        addAction(`${card.name}: Gained ${card.value} block!`, 'player');
        break;
      case 'skill':
        addAction(`${card.name}: Used skill ability!`, 'player');
        break;
    }
  };

  const dealDamageToEnemy = (damage: number) => {
    setEnemy((prev) => {
      const blockDamage = Math.min(prev.block, damage);
      const remainingDamage = damage - blockDamage;
      return {
        ...prev,
        block: prev.block - blockDamage,
        hp: Math.max(0, prev.hp - remainingDamage),
      };
    });
  };

  const dealDamageToPlayer = (damage: number) => {
    setPlayer((prev) => {
      const blockDamage = Math.min(prev.block, damage);
      const remainingDamage = damage - blockDamage;
      return {
        ...prev,
        block: prev.block - blockDamage,
        hp: Math.max(0, prev.hp - remainingDamage),
      };
    });
  };

  const endTurn = () => {
    setIsPlayerTurn(false);
    addAction('Turn ended! Enemy is preparing to attack...', 'system');

    // Clear player block
    setPlayer((prev) => ({ ...prev, block: 0 }));

    // Enemy turn
    setTimeout(() => {
      enemyTurn();
    }, 1000);
  };

  const enemyTurn = () => {
    if (enemy.hp <= 0) return;

    const actions = ['attack', 'defend'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    setTimeout(() => {
      if (action === 'attack') {
        const damage = Math.floor(Math.random() * 8) + 5;
        dealDamageToPlayer(damage);
        addAction(`${enemy.name} attacks for ${damage} damage!`, 'enemy');
      } else {
        const block = Math.floor(Math.random() * 5) + 3;
        setIsEnemyShielding(true);
        setTimeout(() => setIsEnemyShielding(false), 600);
        setEnemy((prev) => ({ ...prev, block: prev.block + block }));
        addAction(`${enemy.name} defends and gains ${block} block!`, 'enemy');
      }

      setTimeout(() => {
        startPlayerTurn();
      }, 1500);
    }, 500);
  };

  const startPlayerTurn = () => {
    setIsPlayerTurn(true);
    setEnergy(maxEnergy);
    setEnemy((prev) => ({ ...prev, block: 0 }));
    addAction('Your turn! Play your cards wisely!', 'system');
  };

  // Check win/lose conditions
  useEffect(() => {
    if (enemy.hp <= 0) {
      addAction('🎉 Victory! Enemy defeated! 🎉', 'system');
    }
    if (player.hp <= 0) {
      addAction('💀 Defeat! You have been defeated... 💀', 'system');
    }
  }, [enemy.hp, player.hp]);

  return (
    <div className="min-h-screen bg-[#F1FAEE] p-6">
      <div className="max-w-7xl mx-auto h-screen flex flex-col gap-4">
        {/* Middle Section: Action Status and Characters */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Action Status */}
          <div className="w-full max-w-3xl">
            <ActionStatus currentAction={currentAction} actionType={actionType} />
          </div>

          {/* Both Characters */}
          <div className="flex justify-between items-center w-full max-w-6xl">
            <Character character={player} isActive={isPlayerTurn} isShielding={isPlayerShielding} />
            <Character character={enemy} isEnemy isActive={!isPlayerTurn} isShielding={isEnemyShielding} />
          </div>
        </div>

        {/* Bottom Section: Energy, End Turn Button, and Hand */}
        <div className="flex flex-col gap-4">
          {/* Energy and End Turn */}
          <div className="flex justify-center items-center gap-6">
            <div className="bg-[#457B9D] rounded-xl px-8 py-4 relative" style={{
              border: '6px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
            }}>
              <div className="flex items-center gap-4">
                <span className="text-white font-black uppercase tracking-wider text-lg" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>Energy:</span>
                <div className="flex gap-2">
                  {Array.from({ length: maxEnergy }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-4 border-black ${
                        i < energy ? 'bg-white' : 'bg-black'
                      }`}
                      style={{
                        boxShadow: '3px 3px 0px rgba(0,0,0,0.6)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              className={`bg-[#F72585] rounded-xl px-16 py-5 font-black text-white text-2xl uppercase tracking-wider relative ${
                !isPlayerTurn || player.hp <= 0 || enemy.hp <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              style={{
                border: '6px solid black',
                boxShadow: '8px 8px 0px rgba(0,0,0,0.8)',
                textShadow: '3px 3px 0px rgba(0,0,0,0.8)',
              }}
              whileHover={isPlayerTurn && player.hp > 0 && enemy.hp > 0 ? { scale: 1.05, y: -2 } : {}}
              whileTap={isPlayerTurn && player.hp > 0 && enemy.hp > 0 ? { scale: 0.95, y: 2 } : {}}
              onClick={endTurn}
              disabled={!isPlayerTurn || player.hp <= 0 || enemy.hp <= 0}
            >
              {/* Checkered pattern accent */}
              <div className="absolute top-0 left-0 right-0 h-2 flex opacity-50">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
              End Turn
              <div className="absolute bottom-0 left-0 right-0 h-2 flex opacity-50">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
                ))}
              </div>
            </motion.button>
          </div>

          {/* Hand */}
          <div className="bg-[#E63946] rounded-3xl p-8 min-h-[280px] flex items-end justify-center relative" style={{
            border: '8px solid black',
            boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
          }}>
            {/* Checkered pattern border */}
            <div className="absolute top-0 left-0 right-0 h-5 flex">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
              ))}
            </div>

            <div className="relative" style={{ width: `${hand.length * 80 + 52}px`, height: '200px' }}>
              {hand.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  totalCards={hand.length}
                  onPlay={playCard}
                  isPlayerTurn={isPlayerTurn && energy >= card.cost && player.hp > 0 && enemy.hp > 0}
                />
              ))}
              {hand.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-black uppercase" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}>
                  No cards in hand
                </div>
              )}
            </div>

            {/* Checkered pattern border bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-5 flex">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}