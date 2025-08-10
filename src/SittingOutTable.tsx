import React from "react";

interface Player {
  id: string;
  name: string;
  isActive: boolean;
}

interface SittingOutTableProps {
  players: Player[];
  handleTogglePlayer: (id: string) => void;
}

export default function SittingOutTable({ players, handleTogglePlayer }: SittingOutTableProps) {
  return (
    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-orange-800">🪑 Sitting Out ({players.length})</h3>
      <div className="space-y-2">
        {players.map(player => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium"
          >
            <span>{player.name}</span>
            <button
              onClick={() => handleTogglePlayer(player.id)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Resume
            </button>
          </div>
        ))}
      </div>
      <p className="text-orange-700 text-xs mt-2">
        Waiting players will join the next shuffle. Paused players can be resumed when ready.
      </p>
    </div>
  );
}
