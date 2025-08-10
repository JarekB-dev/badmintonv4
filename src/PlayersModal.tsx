import React from "react";
import type { Player } from "./types/Player";

interface PlayersModalProps {
  players: Player[];
  handleTogglePlayer: (id: string) => void;
  handleRemovePlayer: (id: string) => void;
  onClose: () => void;
}

export default function PlayersModal({
  players,
  handleTogglePlayer,
  handleRemovePlayer,
  onClose,
}: PlayersModalProps) { 
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Players</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-gray-700">
                {player.name}
                <span className="text-xs ml-1 text-gray-500">({player.sitOutCount})</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTogglePlayer(player.id)}
                  className={`px-2 py-1 text-xs rounded ${
                    player.isActive
                      ? "bg-emerald-200 text-emerald-700 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                  disabled={player.isActive}
                >
                  {player.isActive ? "Activated" : "Activate"}
                </button>
                <button
                  onClick={() => handleRemovePlayer(player.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
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
