import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import PlayersModal from "./PlayersModal";

const STORAGE_KEYS = {
  players: 'badminton-players',
  courtAssignments: 'badminton-court-assignments',
  partnerships: 'badminton-partnerships'
};

interface Player {
  id: string;
  name: string;
  isActive: boolean;
}

interface CourtAssignment {
  courtNumber: number;
  playerIds: string[];
  sessionId: string;
}

interface Partnership {
  player1Id: string;
  player2Id: string;
  timesPlayed: number;
}

@@ -139,50 +140,51 @@ function BadmintonCourt({ court }: { court: CourtWithPlayers }) {
      <div className="mt-4 text-center">
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-white font-medium">Team A</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-white font-medium">Team B</span>
          </div>
        </div>
        <p className="text-white/80 text-xs mt-2">
          {courtPlayers.length}/4 players assigned
        </p>
      </div>
    </div>
  );
}

function BadmintonManager() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [courtAssignments, setCourtAssignments] = useState<CourtAssignment[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);

  useEffect(() => {
    setPlayers(storage.get(STORAGE_KEYS.players, []));
    setCourtAssignments(storage.get(STORAGE_KEYS.courtAssignments, []));
    setPartnerships(storage.get(STORAGE_KEYS.partnerships, []));
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEYS.players, players);
  }, [players]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.courtAssignments, courtAssignments);
  }, [courtAssignments]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.partnerships, partnerships);
  }, [partnerships]);

  const activePlayers = players.filter(p => p.isActive);
  const inactivePlayers = players.filter(p => !p.isActive);

  const getCurrentCourtAssignments = (): CourtWithPlayers[] => {
    if (courtAssignments.length === 0) return [];
    
@@ -331,76 +333,90 @@ function BadmintonManager() {
          for (let j = i + 1; j < courtPlayers.length; j++) {
            updatePartnership(courtPlayers[i].id, courtPlayers[j].id);
          }
        }
      }
    }
    
    setCourtAssignments(newAssignments);
    setIsShuffling(false);
    toast.success(`Players shuffled across ${newAssignments.length} courts!`);
  };

  const handleClearCourts = () => {
    setCourtAssignments([]);
    toast.success("Courts cleared!");
  };

  const handleClearAllData = () => {
    setPlayers([]);
    setCourtAssignments([]);
    setPartnerships([]);
    toast.success("All data cleared!");
  };

  return (
    <>
      {showPlayersModal && (
        <PlayersModal
          players={players}
          handleTogglePlayer={handleTogglePlayer}
          onClose={() => setShowPlayersModal(false)}
        />
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🏸 Player Management</h2>
          
          <form onSubmit={handleAddPlayer} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowPlayersModal(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Players
              </button>
              <button
                onClick={handleShufflePlayers}
                disabled={isShuffling || activePlayers.length === 0}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isShuffling ? "🔄 Shuffling..." : "🎲 Shuffle Players"}
              </button>
              <button
                onClick={handleClearCourts}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Clear All Courts
              </button>
              <button
                onClick={handleClearAllData}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Clear All Data
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {activePlayers.length} active players • Smart pairing enabled
            </p>
          </div>

@@ -476,27 +492,28 @@ function BadmintonManager() {
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentCourts.map((court) => (
                <BadmintonCourt key={court.courtNumber} court={court} />
              ))}
            </div>
          )}

          {sittingOutPlayers.length > 0 && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-orange-800">🪑 Sitting Out ({sittingOutPlayers.length})</h3>
              <div className="grid grid-cols-2 gap-2">
                {sittingOutPlayers.map((player) => (
                  <div key={player.id} className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
                    {player.name}
                  </div>
                ))}
              </div>
              <p className="text-orange-700 text-xs mt-2">
                These players will be included in the next shuffle
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
}
