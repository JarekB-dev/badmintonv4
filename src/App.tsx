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

interface CourtWithPlayers {
  courtNumber: number;
  players: Player[];
}

const storage = {
  get: function<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: function<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🏸 Badminton Court Manager</h1>
        <p className="text-xl text-gray-600">Organize your badminton matches with ease</p>
        <p className="text-sm text-gray-500 mt-2">✨ Local version - all data stored in your browser</p>
      </div>
      <BadmintonManager />
    </div>
  );
}

function BadmintonCourt({ court }: { court: CourtWithPlayers }) {
  const courtPlayers = court.players.filter(Boolean);

  return (
    <div className="relative bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-lg p-6 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white bg-black/20 rounded-full px-4 py-2 inline-block">
          Court {court.courtNumber}
        </h3>
      </div>

      <div className="relative bg-emerald-500 rounded-lg p-4 border-4 border-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1 bg-white/80"></div>
        </div>
        
        <div className="absolute top-6 left-4 right-4 h-0.5 bg-white/60"></div>
        <div className="absolute bottom-6 left-4 right-4 h-0.5 bg-white/60"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/60 transform -translate-x-0.5"></div>

        <div className="relative h-48 grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-start items-center pt-2 space-y-2">
            {courtPlayers.slice(0, 2).map((player) => (
              <div
                key={player.id}
                className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-md min-w-20 text-center"
              >
                {player.name}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 2 - courtPlayers.slice(0, 2).length) }).map((_, index) => (
              <div
                key={`top-empty-${index}`}
                className="bg-gray-300 text-gray-500 px-3 py-2 rounded-full text-sm italic min-w-20 text-center border-2 border-dashed border-gray-400"
              >
                Empty
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-end items-center pb-2 space-y-2">
            {Array.from({ length: Math.max(0, 2 - courtPlayers.slice(2, 4).length) }).map((_, index) => (
              <div
                key={`bottom-empty-${index}`}
                className="bg-gray-300 text-gray-500 px-3 py-2 rounded-full text-sm italic min-w-20 text-center border-2 border-dashed border-gray-400"
              >
                Empty
              </div>
            ))}
            {courtPlayers.slice(2, 4).reverse().map((player) => (
              <div
                key={player.id}
                className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-md min-w-20 text-center"
              >
                {player.name}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2">
          <div className="h-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full shadow-md"></div>
          <div className="flex justify-center mt-1">
            <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>

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

  const getCurrentCourtAssignments = (): CourtWithPlayers[] => {
    if (courtAssignments.length === 0) return [];
    
    const latestSessionId = courtAssignments[courtAssignments.length - 1]?.sessionId;
    const currentAssignments = courtAssignments.filter(a => a.sessionId === latestSessionId);
    
    return currentAssignments.map(assignment => ({
      courtNumber: assignment.courtNumber,
      players: assignment.playerIds.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[]
    })).sort((a, b) => a.courtNumber - b.courtNumber);
  };

  const currentCourts = getCurrentCourtAssignments();
  
  const playingPlayerIds = new Set(
    currentCourts.flatMap(court => court.players.map(p => p.id))
  );
  const sittingOutPlayers = activePlayers.filter(player => !playingPlayerIds.has(player.id));

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    if (players.some(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      toast.error("Player with this name already exists");
      return;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random()}`,
      name: newPlayerName.trim(),
      isActive: true
    };

    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName("");
    toast.success("Player added successfully!");
  };

  const handleSavePlayer = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newPlayerName.trim()) return;

    if (players.some(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      toast.error("Player with this name already exists");
      return;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random()}`,
      name: newPlayerName.trim(),
      isActive: false
    };

    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName("");
    toast.success("Player saved successfully!");
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    setPartnerships(prev => prev.filter(p => p.player1Id !== playerId && p.player2Id !== playerId));
    toast.success("Player removed!");
  };

  const handleTogglePlayer = (playerId: string) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleDeactivatePlayer = (playerId: string) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, isActive: false } : p
    ));
  };

  const getPartnershipCount = (p1Id: string, p2Id: string): number => {
    const partnership = partnerships.find(p => 
      (p.player1Id === p1Id && p.player2Id === p2Id) ||
      (p.player1Id === p2Id && p.player2Id === p1Id)
    );
    return partnership?.timesPlayed || 0;
  };

  const updatePartnership = (p1Id: string, p2Id: string) => {
    setPartnerships(prev => {
      const existing = prev.find(p => 
        (p.player1Id === p1Id && p.player2Id === p2Id) ||
        (p.player1Id === p2Id && p.player2Id === p1Id)
      );

      if (existing) {
        return prev.map(p => 
          p === existing ? { ...p, timesPlayed: p.timesPlayed + 1 } : p
        );
      } else {
        return [...prev, { player1Id: p1Id, player2Id: p2Id, timesPlayed: 1 }];
      }
    });
  };

  const handleShufflePlayers = () => {
    if (activePlayers.length === 0) {
      toast.error("No active players to shuffle");
      return;
    }

    setIsShuffling(true);

    const assignPlayersToTeams = (playerList: Player[]) => {
      const teams: Array<[Player, Player]> = [];
      const usedPlayers = new Set<string>();
      
      const sortedPlayers = [...playerList].sort((a, b) => {
        const aPartnerships = partnerships.filter(p => p.player1Id === a.id || p.player2Id === a.id).length;
        const bPartnerships = partnerships.filter(p => p.player1Id === b.id || p.player2Id === b.id).length;
        return aPartnerships - bPartnerships;
      });
      
      for (const player1 of sortedPlayers) {
        if (usedPlayers.has(player1.id)) continue;
        
        let bestPartner = null;
        let minPartnerships = Infinity;
        
        for (const player2 of sortedPlayers) {
          if (usedPlayers.has(player2.id) || player1.id === player2.id) continue;
          
          const partnershipCount = getPartnershipCount(player1.id, player2.id);
          if (partnershipCount < minPartnerships) {
            minPartnerships = partnershipCount;
            bestPartner = player2;
          }
        }
        
        if (bestPartner) {
          teams.push([player1, bestPartner]);
          usedPlayers.add(player1.id);
          usedPlayers.add(bestPartner.id);
        }
      }
      
      return teams;
    };

    const teams = assignPlayersToTeams(activePlayers);
    
    const shuffledTeams = [...teams];
    for (let i = shuffledTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
    }
    
    const sessionId = `session_${Date.now()}`;
    
    const newAssignments: CourtAssignment[] = [];
    for (let courtNum = 1; courtNum <= 4; courtNum++) {
      const startIndex = (courtNum - 1) * 2;
      const endIndex = startIndex + 2;
      const courtTeams = shuffledTeams.slice(startIndex, endIndex);
      
      if (courtTeams.length > 0) {
        const courtPlayers = courtTeams.flat();
        newAssignments.push({
          courtNumber: courtNum,
          playerIds: courtPlayers.map(p => p.id),
          sessionId,
        });
        
        for (let i = 0; i < courtPlayers.length; i++) {
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
    setPlayers(prev => prev.map(p => ({ ...p, isActive: false })));
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
          handleRemovePlayer={handleRemovePlayer}
          onClose={() => setShowPlayersModal(false)}
        />
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🏸 Player Management</h2>
          
          <form onSubmit={handleAddPlayer} className="mb-6">
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleSavePlayer}
                disabled={!newPlayerName.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </form>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setShowPlayersModal(true)}
                className="w-full aspect-square flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl">👤</span>
                  <span className="mt-1 text-xs">Players</span>
                </div>
              </button>
              <button
                onClick={handleShufflePlayers}
                disabled={isShuffling || activePlayers.length === 0}
                className="w-full aspect-square flex items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl">{isShuffling ? "🔄" : "🔀"}</span>
                  <span className="mt-1 text-xs">{isShuffling ? "Shuffling..." : "Shuffle"}</span>
                </div>
              </button>
              <button
                onClick={handleClearCourts}
                className="w-full aspect-square flex items-center justify-center bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold"
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl">🧹</span>
                  <span className="mt-1 text-xs">Clear Courts</span>
                </div>
              </button>
              <button
                onClick={handleClearAllData}
                className="w-full aspect-square flex items-center justify-center bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl">🗑️</span>
                  <span className="mt-1 text-xs">Clear All Data</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {activePlayers.length} active players • Smart pairing enabled
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              ✅ Active Players ({activePlayers.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activePlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-medium text-gray-800">{player.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTogglePlayer(player.id)}
                      className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleDeactivatePlayer(player.id)}
                      className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🏟️ Court Assignments</h2>

          {currentCourts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏸</div>
              <p className="text-lg">No court assignments yet.</p>
              <p className="text-sm mt-2">Add some players and click "Shuffle Players" to get started!</p>
            </div>
          ) : (
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
