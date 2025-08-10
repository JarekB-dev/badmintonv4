import React from "react";

interface Player {
  id: string;
  name: string;
  isActive: boolean;
}

interface PlayersModalProps {
  players: Player[];
  handleTogglePlayer: (id: string) => void;
  onClose: () => void;
}

export default function PlayersModal({ players, handleTogglePlayer, onClose }: PlayersModalProps) {
  const inactivePlayers = players.filter(p => !p.isActive);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Inactive Players</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {inactivePlayers.length === 0 && (
            <p className="text-gray-600 text-sm">All players are active.</p>
          )}
          {inactivePlayers.map(player => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-700">{player.name}</span>
              <button
                onClick={() => handleTogglePlayer(player.id)}
                className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
              >
                Activate
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
