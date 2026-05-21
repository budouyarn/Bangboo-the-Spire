import { motion, AnimatePresence } from 'motion/react';

interface ActionStatusProps {
  currentAction: string;
  actionType: 'player' | 'enemy' | 'system';
}

export function ActionStatus({ currentAction, actionType }: ActionStatusProps) {
  const getActionColor = () => {
    switch (actionType) {
      case 'player':
        return 'bg-[#6B7280]';
      case 'enemy':
        return 'bg-[#FF6B35]';
      case 'system':
        return 'bg-[#FF8C42]';
      default:
        return 'bg-[#374151]';
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'player':
        return '⚔️';
      case 'enemy':
        return '💀';
      case 'system':
        return '⚡';
      default:
        return '●';
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAction}
          className={`${getActionColor()} rounded-2xl p-8 shadow-2xl max-w-2xl w-full relative`}
          style={{
            border: '8px solid black',
            boxShadow: '12px 12px 0px rgba(0,0,0,0.8)',
          }}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            {/* Icon Badge */}
            <motion.div
              className="absolute -left-4 -top-4 bg-white border-6 border-black rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg"
              style={{
                boxShadow: '6px 6px 0px rgba(0,0,0,0.6)',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.05 }}
            >
              {getActionIcon()}
            </motion.div>

            {/* Action Text */}
            <div className="pl-16 pr-4">
              <motion.h2
                className="text-white font-black text-3xl uppercase tracking-wide leading-tight"
                style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentAction}
              </motion.h2>
            </div>

            {/* Animated pulse effect */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-xl -z-10"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}