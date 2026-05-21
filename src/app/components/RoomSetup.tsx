import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Users, Loader2 } from 'lucide-react';

interface RoomSetupProps {
  mode: 'coop' | 'pvp';
  onStartGame: (roomData: {
    roomCode: string;
    playerId: string;
    playerNumber: 1 | 2;
    isHost: boolean;
  }) => void;
  onBack: () => void;
}

export function RoomSetup({ mode, onStartGame, onBack }: RoomSetupProps) {
  const [view, setView] = useState<'choice' | 'create' | 'join'>('choice');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const createRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectId = (await import('/utils/supabase/info')).projectId;
      const publicAnonKey = (await import('/utils/supabase/info')).publicAnonKey;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-19145fc9/rooms/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            mode,
            hostName: playerName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create room');
      }

      setCreatedRoom(data.room);
      // Poll for guest to join
      pollForGuest(data.room.code);
    } catch (err: any) {
      console.error('Error creating room:', err);
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const pollForGuest = async (code: string) => {
    const interval = setInterval(async () => {
      try {
        const projectId = (await import('/utils/supabase/info')).projectId;
        const publicAnonKey = (await import('/utils/supabase/info')).publicAnonKey;

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-19145fc9/rooms/${code}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();

        if (data.room && data.room.guestId) {
          clearInterval(interval);
          // Guest joined, start game
          onStartGame({
            roomCode: code,
            playerId: data.room.hostId,
            playerNumber: 1,
            isHost: true,
          });
        }
      } catch (err) {
        console.error('Error polling room:', err);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  };

  const joinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectId = (await import('/utils/supabase/info')).projectId;
      const publicAnonKey = (await import('/utils/supabase/info')).publicAnonKey;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-19145fc9/rooms/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            roomCode: roomCode.trim().toUpperCase(),
            guestName: playerName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join room');
      }

      // Successfully joined, start game
      onStartGame({
        roomCode: roomCode.trim().toUpperCase(),
        playerId: data.room.guestId,
        playerNumber: 2,
        isHost: false,
      });
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    if (createdRoom) {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(createdRoom.code)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            // Fallback to older method
            fallbackCopy(createdRoom.code);
          });
      } else {
        // Fallback to older method
        fallbackCopy(createdRoom.code);
      }
    }
  };

  const fallbackCopy = (text: string) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Even if copy fails, show copied state briefly as visual feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    
    textArea.remove();
  };

  const modeTitle = mode === 'coop' ? 'Co-op' : 'PVP';

  if (createdRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
        
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-[#6B7280] rounded-3xl p-12 max-w-2xl w-full"
          style={{
            border: '8px solid black',
            boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
          }}
        >
          <h2
            className="text-5xl font-black text-white uppercase text-center mb-8"
            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
          >
            Room Created!
          </h2>

          <div className="bg-[#FF8C42] rounded-2xl p-8 mb-8" style={{ border: '6px solid black' }}>
            <p
              className="text-white font-bold text-xl text-center mb-4"
              style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
            >
              Share this code with your friend:
            </p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="bg-white px-8 py-4 rounded-xl font-black text-5xl tracking-widest"
                style={{
                  border: '4px solid black',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
                }}
              >
                {createdRoom.code}
              </div>
              <motion.button
                onClick={copyRoomCode}
                className="bg-white p-4 rounded-xl"
                style={{
                  border: '4px solid black',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
                ) : (
                  <Copy className="w-8 h-8 text-[#6B7280]" strokeWidth={3} />
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Loader2 className="w-8 h-8 text-[#FF8C42] animate-spin" strokeWidth={3} />
            <p
              className="text-white font-bold text-2xl"
              style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
            >
              Waiting for player to join...
            </p>
          </div>

          <motion.button
            onClick={onBack}
            className="w-full bg-[#374151] text-white py-4 rounded-xl font-black text-xl uppercase"
            style={{
              border: '6px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (view === 'choice') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
        
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center gap-8"
        >
          <h2
            className="text-6xl font-black text-white uppercase text-center"
            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
          >
            {modeTitle} Setup
          </h2>

          <div className="flex gap-6">
            <motion.button
              onClick={() => setView('create')}
              className="bg-[#FF6B35] rounded-3xl px-12 py-8 flex flex-col items-center gap-4"
              style={{
                border: '8px solid black',
                boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
                width: '280px',
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-16 h-16 text-white" strokeWidth={3} />
              <span
                className="text-white font-black text-2xl uppercase"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Create Room
              </span>
            </motion.button>

            <motion.button
              onClick={() => setView('join')}
              className="bg-[#6B7280] rounded-3xl px-12 py-8 flex flex-col items-center gap-4"
              style={{
                border: '8px solid black',
                boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
                width: '280px',
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-16 h-16 text-white" strokeWidth={3} />
              <span
                className="text-white font-black text-2xl uppercase"
                style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
              >
                Join Room
              </span>
            </motion.button>
          </div>

          <motion.button
            onClick={onBack}
            className="bg-[#374151] text-white py-4 px-12 rounded-xl font-black text-xl uppercase mt-4"
            style={{
              border: '6px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
        
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-[#6B7280] rounded-3xl p-12 max-w-lg w-full"
          style={{
            border: '8px solid black',
            boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
          }}
        >
          <h2
            className="text-5xl font-black text-white uppercase text-center mb-8"
            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
          >
            Create Room
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-white font-bold text-xl mb-3"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
              >
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-xl font-bold text-xl"
                style={{
                  border: '6px solid black',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
                }}
                maxLength={20}
              />
            </div>

            {error && (
              <div
                className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-center"
                style={{
                  border: '4px solid black',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.6)',
                }}
              >
                {error}
              </div>
            )}

            <motion.button
              onClick={createRoom}
              disabled={loading}
              className="w-full bg-[#FF6B35] text-white py-5 rounded-xl font-black text-2xl uppercase flex items-center justify-center gap-3"
              style={{
                border: '6px solid black',
                boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
              }}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading && <Loader2 className="w-6 h-6 animate-spin" />}
              {loading ? 'Creating...' : 'Create Room'}
            </motion.button>

            <motion.button
              onClick={() => setView('choice')}
              className="w-full bg-[#374151] text-white py-4 rounded-xl font-black text-xl uppercase"
              style={{
                border: '6px solid black',
                boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Join view
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
      
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-[#6B7280] rounded-3xl p-12 max-w-lg w-full"
        style={{
          border: '8px solid black',
          boxShadow: '10px 10px 0px rgba(0,0,0,0.8)',
        }}
      >
        <h2
          className="text-5xl font-black text-white uppercase text-center mb-8"
          style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
        >
          Join Room
        </h2>

        <div className="space-y-6">
          <div>
            <label
              className="block text-white font-bold text-xl mb-3"
              style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 rounded-xl font-bold text-xl"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
              maxLength={20}
            />
          </div>

          <div>
            <label
              className="block text-white font-bold text-xl mb-3"
              style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.6)' }}
            >
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              className="w-full px-6 py-4 rounded-xl font-bold text-2xl tracking-widest text-center uppercase"
              style={{
                border: '6px solid black',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
              }}
              maxLength={6}
            />
          </div>

          {error && (
            <div
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-center"
              style={{
                border: '4px solid black',
                textShadow: '2px 2px 0px rgba(0,0,0,0.6)',
              }}
            >
              {error}
            </div>
          )}

          <motion.button
            onClick={joinRoom}
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white py-5 rounded-xl font-black text-2xl uppercase flex items-center justify-center gap-3"
            style={{
              border: '6px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
            }}
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading && <Loader2 className="w-6 h-6 animate-spin" />}
            {loading ? 'Joining...' : 'Join Room'}
          </motion.button>

          <motion.button
            onClick={() => setView('choice')}
            className="w-full bg-[#374151] text-white py-4 rounded-xl font-black text-xl uppercase"
            style={{
              border: '6px solid black',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}