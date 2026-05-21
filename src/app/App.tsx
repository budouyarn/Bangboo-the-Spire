import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardType } from './components/Card';
import { Character, CharacterData } from './components/Character';
import { ActionStatus } from './components/ActionStatus';
import { GameModeMenu } from './components/GameModeMenu';
import { MultiplayerMenu } from './components/MultiplayerMenu';
import { RoomSetup } from './components/RoomSetup';
import backgroundImage from 'figma:asset/d47cdd7bd495f8adeba221591dfbcdd655670b7e.png';

interface CardData {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  value: number;
  description: string;
}

type GameMode = 'menu' | 'multiplayer-choice' | 'room-setup' | 'single' | 'coop' | 'pvp' | 'coop-online' | 'pvp-online';

interface RoomData {
  roomCode: string;
  playerId: string;
  playerNumber: 1 | 2;
  isHost: boolean;
}

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [selectedMultiplayerMode, setSelectedMultiplayerMode] = useState<'coop' | 'pvp' | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const [player1, setPlayer1] = useState<CharacterData>({
    name: 'Hero 1',
    hp: 80,
    maxHp: 80,
    block: 0,
  });

  const [player2, setPlayer2] = useState<CharacterData>({
    name: 'Hero 2',
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

  const [hand1, setHand1] = useState<CardData[]>([]);
  const [hand2, setHand2] = useState<CardData[]>([]);
  const [energy1, setEnergy1] = useState(3);
  const [energy2, setEnergy2] = useState(3);
  const [maxEnergy] = useState(3);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [currentAction, setCurrentAction] = useState('Battle begins!');
  const [actionType, setActionType] = useState<'player' | 'enemy' | 'system'>('system');
  const [isPlayerShielding, setIsPlayerShielding] = useState(false);
  const [isEnemyShielding, setIsEnemyShielding] = useState(false);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);

  const addAction = (text: string, type: 'player' | 'enemy' | 'system') => {
    setCurrentAction(text);
    setActionType(type);
  };

  const startGame = (mode: 'single' | 'coop' | 'pvp') => {
    setGameMode(mode);
    setCurrentPlayer(1);
    
    // Reset HP for all characters
    setPlayer1({ name: 'Hero 1', hp: 80, maxHp: 80, block: 0 });
    setPlayer2({ name: 'Hero 2', hp: 80, maxHp: 80, block: 0 });
    setEnemy({ name: 'Goblin Warrior', hp: 50, maxHp: 50, block: 0 });
    
    // Reset energies
    setEnergy1(3);
    setEnergy2(3);
    
    // Initialize hands
    const startingHand: CardData[] = [
      { id: '1', name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage' },
      { id: '2', name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage' },
      { id: '3', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '4', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '5', name: 'Power Strike', type: 'attack', cost: 2, value: 12, description: 'Deal 12 damage' },
    ];

    const startingHand2: CardData[] = [
      { id: '6', name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage' },
      { id: '7', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '8', name: 'Defend', type: 'defend', cost: 1, value: 5, description: 'Gain 5 block' },
      { id: '9', name: 'Bash', type: 'attack', cost: 2, value: 10, description: 'Deal 10 damage' },
      { id: '10', name: 'Iron Guard', type: 'defend', cost: 2, value: 8, description: 'Gain 8 block' },
    ];

    setHand1(startingHand);
    setHand2(startingHand2);
    
    if (mode === 'pvp') {
      addAction('PVP Battle begins! Player 1\'s turn to play!', 'system');
    } else if (mode === 'coop') {
      addAction('Battle begins! Player 1\'s turn to play!', 'system');
    } else {
      addAction('Battle begins! Your turn to play!', 'system');
    }
  };

  const getCurrentPlayer = () => {
    if (gameMode === 'pvp') {
      return currentPlayer === 1 ? player1 : player2;
    }
    return gameMode === 'coop' && currentPlayer === 2 ? player2 : player1;
  };

  const setCurrentPlayerData = (updateFn: (prev: CharacterData) => CharacterData) => {
    if (gameMode === 'pvp' || gameMode === 'coop') {
      if (currentPlayer === 2) {
        setPlayer2(updateFn);
      } else {
        setPlayer1(updateFn);
      }
    } else {
      setPlayer1(updateFn);
    }
  };

  const getOpponentPlayerData = () => {
    if (gameMode === 'pvp') {
      return currentPlayer === 1 ? player2 : player1;
    }
    return null;
  };

  const setOpponentPlayerData = (updateFn: (prev: CharacterData) => CharacterData) => {
    if (gameMode === 'pvp') {
      if (currentPlayer === 1) {
        setPlayer2(updateFn);
      } else {
        setPlayer1(updateFn);
      }
    }
  };

  const getCurrentHand = () => {
    if (gameMode === 'pvp' || gameMode === 'coop') {
      return currentPlayer === 2 ? hand2 : hand1;
    }
    return hand1;
  };

  const getCurrentEnergy = () => {
    if (gameMode === 'pvp' || gameMode === 'coop') {
      return currentPlayer === 2 ? energy2 : energy1;
    }
    return energy1;
  };

  const setCurrentEnergy = (updateFn: (prev: number) => number) => {
    if (gameMode === 'pvp' || gameMode === 'coop') {
      if (currentPlayer === 2) {
        setEnergy2(updateFn);
      } else {
        setEnergy1(updateFn);
      }
    } else {
      setEnergy1(updateFn);
    }
  };

  const playCard = (card: CardData) => {
    const energy = getCurrentEnergy();
    
    if (!isPlayerTurn || energy < card.cost) {
      addAction('Not enough energy to play that card!', 'system');
      return;
    }

    setCurrentEnergy((prev) => prev - card.cost);

    const playerName = (gameMode === 'coop' || gameMode === 'pvp') ? `Player ${currentPlayer}` : 'You';

    switch (card.type) {
      case 'attack':
        if (gameMode === 'pvp') {
          // In PVP, attack the opponent player
          setIsEnemyAttacking(true);
          setTimeout(() => setIsEnemyAttacking(false), 600);
          dealDamageToOpponent(card.value);
          addAction(`${playerName} used ${card.name}: Dealt ${card.value} damage to opponent!`, 'player');
        } else {
          // In single player or co-op, attack the enemy
          setIsEnemyAttacking(true);
          setTimeout(() => setIsEnemyAttacking(false), 600);
          dealDamageToEnemy(card.value);
          addAction(`${playerName} used ${card.name}: Dealt ${card.value} damage to enemy!`, 'player');
        }
        break;
      case 'defend':
        setIsPlayerShielding(true);
        setTimeout(() => setIsPlayerShielding(false), 600);
        setCurrentPlayerData((prev) => ({ ...prev, block: prev.block + card.value }));
        addAction(`${playerName} used ${card.name}: Gained ${card.value} block!`, 'player');
        break;
      case 'skill':
        addAction(`${playerName} used ${card.name}: Used skill ability!`, 'player');
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

  const dealDamageToOpponent = (damage: number) => {
    if (gameMode === 'pvp') {
      setOpponentPlayerData((prev) => {
        const blockDamage = Math.min(prev.block, damage);
        const remainingDamage = damage - blockDamage;
        return {
          ...prev,
          block: prev.block - blockDamage,
          hp: Math.max(0, prev.hp - remainingDamage),
        };
      });
    }
  };

  const dealDamageToPlayer = (damage: number) => {
    if (gameMode === 'coop') {
      // In co-op, damage goes to the current active player
      setCurrentPlayerData((prev) => {
        const blockDamage = Math.min(prev.block, damage);
        const remainingDamage = damage - blockDamage;
        return {
          ...prev,
          block: prev.block - blockDamage,
          hp: Math.max(0, prev.hp - remainingDamage),
        };
      });
    } else {
      setPlayer1((prev) => {
        const blockDamage = Math.min(prev.block, damage);
        const remainingDamage = damage - blockDamage;
        return {
          ...prev,
          block: prev.block - blockDamage,
          hp: Math.max(0, prev.hp - remainingDamage),
        };
      });
    }
  };

  const endTurn = () => {
    setIsPlayerTurn(false);
    
    if (gameMode === 'pvp') {
      addAction(`Player ${currentPlayer}'s turn ended!`, 'system');
      // Clear current player block
      setCurrentPlayerData((prev) => ({ ...prev, block: 0 }));
      
      // In PVP, directly switch to other player - no enemy turn
      setTimeout(() => {
        pvpSwitchPlayer();
      }, 1000);
    } else if (gameMode === 'coop') {
      addAction(`Player ${currentPlayer}'s turn ended! Enemy is preparing to attack...`, 'system');
      // Clear current player block
      setCurrentPlayerData((prev) => ({ ...prev, block: 0 }));
      
      // Enemy turn
      setTimeout(() => {
        enemyTurn();
      }, 1000);
    } else {
      addAction('Turn ended! Enemy is preparing to attack...', 'system');
      // Clear current player block
      setCurrentPlayerData((prev) => ({ ...prev, block: 0 }));
      
      // Enemy turn
      setTimeout(() => {
        enemyTurn();
      }, 1000);
    }
  };

  const pvpSwitchPlayer = () => {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    setIsPlayerTurn(true);
    
    // Clear opponent block
    setOpponentPlayerData((prev) => ({ ...prev, block: 0 }));
    
    // Restore energy for next player
    if (nextPlayer === 1) {
      setEnergy1(maxEnergy);
    } else {
      setEnergy2(maxEnergy);
    }
    
    addAction(`Player ${nextPlayer}'s turn! Play your cards wisely!`, 'system');
  };

  const enemyTurn = () => {
    if (enemy.hp <= 0) return;

    const actions = ['attack', 'defend'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    setTimeout(() => {
      if (action === 'attack') {
        setIsPlayerAttacking(true);
        setTimeout(() => setIsPlayerAttacking(false), 600);
        const damage = Math.floor(Math.random() * 8) + 5;
        dealDamageToPlayer(damage);
        
        if (gameMode === 'coop') {
          addAction(`${enemy.name} attacks Player ${currentPlayer} for ${damage} damage!`, 'enemy');
        } else {
          addAction(`${enemy.name} attacks for ${damage} damage!`, 'enemy');
        }
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
    setEnemy((prev) => ({ ...prev, block: 0 }));
    
    if (gameMode === 'coop') {
      // Switch to next player
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      
      // Restore energy for next player
      if (nextPlayer === 1) {
        setEnergy1(maxEnergy);
      } else {
        setEnergy2(maxEnergy);
      }
      
      addAction(`Player ${nextPlayer}'s turn! Play your cards wisely!`, 'system');
    } else {
      setEnergy1(maxEnergy);
      addAction('Your turn! Play your cards wisely!', 'system');
    }
  };

  // Check win/lose conditions
  useEffect(() => {
    if (gameMode === 'menu') return;
    
    if (gameMode === 'pvp') {
      if (player1.hp <= 0) {
        addAction('🎉 Player 2 Wins! 🎉', 'system');
      } else if (player2.hp <= 0) {
        addAction('🎉 Player 1 Wins! 🎉', 'system');
      }
    } else if (gameMode === 'coop') {
      if (enemy.hp <= 0) {
        addAction('🎉 Victory! Enemy defeated! 🎉', 'system');
      }
      if (player1.hp <= 0 && player2.hp <= 0) {
        addAction('💀 Defeat! Both heroes have been defeated... 💀', 'system');
      }
    } else {
      if (enemy.hp <= 0) {
        addAction('🎉 Victory! Enemy defeated! 🎉', 'system');
      }
      if (player1.hp <= 0) {
        addAction('💀 Defeat! You have been defeated... 💀', 'system');
      }
    }
  }, [enemy.hp, player1.hp, player2.hp, gameMode]);

  if (gameMode === 'menu') {
    return <GameModeMenu onSelectMode={(mode) => {
      if (mode === 'single') {
        startGame('single');
      } else {
        // For co-op and PVP, show multiplayer choice menu
        setSelectedMultiplayerMode(mode);
        setGameMode('multiplayer-choice');
      }
    }} />;
  }

  if (gameMode === 'multiplayer-choice' && selectedMultiplayerMode) {
    return (
      <MultiplayerMenu
        mode={selectedMultiplayerMode}
        onSelectType={(type) => {
          if (type === 'local') {
            // Start local game
            startGame(selectedMultiplayerMode);
          } else {
            // Show room setup for online play
            setGameMode('room-setup');
          }
        }}
        onBack={() => {
          setGameMode('menu');
          setSelectedMultiplayerMode(null);
        }}
      />
    );
  }

  if (gameMode === 'room-setup' && selectedMultiplayerMode) {
    return (
      <RoomSetup
        mode={selectedMultiplayerMode}
        onStartGame={(data) => {
          setRoomData(data);
          // Start online game
          const onlineMode = selectedMultiplayerMode === 'coop' ? 'coop-online' : 'pvp-online';
          setGameMode(onlineMode as GameMode);
          startGame(selectedMultiplayerMode);
        }}
        onBack={() => {
          setGameMode('multiplayer-choice');
        }}
      />
    );
  }

  const activePlayer = getCurrentPlayer();
  const currentHand = getCurrentHand();
  const currentEnergy = getCurrentEnergy();
  
  let isGameOver = false;
  if (gameMode === 'pvp') {
    isGameOver = player1.hp <= 0 || player2.hp <= 0;
  } else if (gameMode === 'coop') {
    isGameOver = enemy.hp <= 0 || (player1.hp <= 0 && player2.hp <= 0);
  } else {
    isGameOver = enemy.hp <= 0 || player1.hp <= 0;
  }

  return (
    <div className="min-h-screen px-6 pb-6 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Game Content */}
      <div className="max-w-7xl mx-auto h-screen flex flex-col gap-4 relative z-10">
        {/* Middle Section: Action Status and Characters */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Action Status */}
          <div className="w-full max-w-3xl">
            <ActionStatus currentAction={currentAction} actionType={actionType} />
          </div>

          {/* Characters */}
          {gameMode === 'pvp' ? (
            <div className="flex justify-between items-center w-full max-w-6xl">
              <div className="relative">
                <Character 
                  character={player1} 
                  isActive={currentPlayer === 1} 
                  isShielding={isPlayerShielding && currentPlayer === 1} 
                  isAttacking={isEnemyAttacking && currentPlayer === 2} 
                />
                {currentPlayer === 1 && (
                  <div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FF6B35] px-4 py-1 rounded-lg font-black text-white uppercase text-sm"
                    style={{
                      border: '3px solid black',
                      boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                    }}
                  >
                    Active
                  </div>
                )}
              </div>
              <div className="relative">
                <Character 
                  character={player2} 
                  isEnemy
                  isActive={currentPlayer === 2} 
                  isShielding={isEnemyShielding && currentPlayer === 2} 
                  isAttacking={isEnemyAttacking && currentPlayer === 1} 
                />
                {currentPlayer === 2 && (
                  <div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FF6B35] px-4 py-1 rounded-lg font-black text-white uppercase text-sm"
                    style={{
                      border: '3px solid black',
                      boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                    }}
                  >
                    Active
                  </div>
                )}
              </div>
            </div>
          ) : gameMode === 'coop' ? (
            <div className="flex justify-between items-center w-full max-w-6xl">
              <div className="flex gap-8">
                <div className="relative">
                  <Character 
                    character={player1} 
                    isActive={isPlayerTurn && currentPlayer === 1} 
                    isShielding={isPlayerShielding && currentPlayer === 1} 
                    isAttacking={isPlayerAttacking && currentPlayer === 1} 
                  />
                  {currentPlayer === 1 && isPlayerTurn && (
                    <div 
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FF6B35] px-4 py-1 rounded-lg font-black text-white uppercase text-sm"
                      style={{
                        border: '3px solid black',
                        boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                      }}
                    >
                      Active
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Character 
                    character={player2} 
                    isActive={isPlayerTurn && currentPlayer === 2} 
                    isShielding={isPlayerShielding && currentPlayer === 2} 
                    isAttacking={isPlayerAttacking && currentPlayer === 2} 
                  />
                  {currentPlayer === 2 && isPlayerTurn && (
                    <div 
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FF6B35] px-4 py-1 rounded-lg font-black text-white uppercase text-sm"
                      style={{
                        border: '3px solid black',
                        boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                      }}
                    >
                      Active
                    </div>
                  )}
                </div>
              </div>
              <Character character={enemy} isEnemy isActive={!isPlayerTurn} isShielding={isEnemyShielding} isAttacking={isEnemyAttacking} />
            </div>
          ) : (
            <div className="flex justify-between items-center w-full max-w-6xl">
              <Character character={player1} isActive={isPlayerTurn} isShielding={isPlayerShielding} isAttacking={isPlayerAttacking} />
              <Character character={enemy} isEnemy isActive={!isPlayerTurn} isShielding={isEnemyShielding} isAttacking={isEnemyAttacking} />
            </div>
          )}
        </div>

        {/* Bottom Section: Energy, End Turn Button, and Hand */}
        <div className="flex flex-col gap-4">
          {/* Energy and End Turn */}
          <div className="flex justify-center items-center gap-6">
            {(gameMode === 'coop' || gameMode === 'pvp') && (
              <div 
                className="bg-[#FF8C42] rounded-xl px-6 py-3 font-black text-white uppercase text-lg"
                style={{
                  border: '6px solid black',
                  boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                }}
              >
                Player {currentPlayer}
              </div>
            )}
            
            <div className="bg-[#6B7280] rounded-xl px-8 py-4 relative" style={{
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
                        i < currentEnergy ? 'bg-[#FF8C42]' : 'bg-[#374151]'
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
              className={`bg-[#FF6B35] rounded-xl px-16 py-5 font-black text-white text-2xl uppercase tracking-wider relative ${
                !isPlayerTurn || isGameOver
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              style={{
                border: '6px solid black',
                boxShadow: '8px 8px 0px rgba(0,0,0,0.8)',
                textShadow: '3px 3px 0px rgba(0,0,0,0.8)',
              }}
              whileHover={isPlayerTurn && !isGameOver ? { scale: 1.05, y: -2 } : {}}
              whileTap={isPlayerTurn && !isGameOver ? { scale: 0.95, y: 2 } : {}}
              onClick={endTurn}
              disabled={!isPlayerTurn || isGameOver}
            >
              End Turn
            </motion.button>
          </div>

          {/* Hand */}
          <div className="bg-[#FF8C42] rounded-3xl p-8 min-h-[300px] flex items-end justify-center relative" style={{
            border: '8px solid black',
            boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
          }}>
            <div className="relative" style={{ width: `${currentHand.length * 80 + 52}px`, height: '220px' }}>
              {currentHand.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  totalCards={currentHand.length}
                  onPlay={playCard}
                  isPlayerTurn={isPlayerTurn && currentEnergy >= card.cost && !isGameOver}
                />
              ))}
              {currentHand.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-black uppercase" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}>
                  No cards in hand
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}