import { useNavigate, useOutletContext } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useGamesQuery } from "@/hooks/useGames";
import { useGameFilters } from "@/hooks/useGameFilters";
import LibraryFilters from "@/components/game-list/Filters";
import Card from "@/components/game/Card";
import EmptyState from "@/components/game-list/EmptyState";
import { RootLayoutContext } from "@/layouts/RootLayout";
import { RouteLinks } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

export default function Games() {
  const navigate = useNavigate();
  const { openAddGame } = useOutletContext<RootLayoutContext>();
  const { data: games = [], isLoading, isError, error, refetch } = useGamesQuery();
  const filter = useGameFilters(games);

  return (
    <div className="space-y-6 pb-16">
      <LibraryFilters
        search={filter.search}
        updateSearch={filter.updateSearch}
        platform={filter.platform}
        setPlatform={filter.setPlatform}
        status={filter.status}
        setStatus={filter.setStatus}
        progress={filter.progress}
        setProgress={filter.setProgress}
      />

      {isLoading && <Spinner />}

      {isError && !isLoading && (
        <div className="bg-white dark:bg-[#090e1c] border border-rose-500/30 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-lg">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Failed to Load Games</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error?.message || "An error occurred."}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
            Retry Loading
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {filter.filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filter.filteredGames.map((game) => (
                <Card key={game.id} game={game} onClick={() => navigate(`${RouteLinks.GameOverview}/${game.id}`)} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={filter.hasActiveFilters} onReset={filter.resetFilters} onAddGame={openAddGame} />
          )}
        </>
      )}
    </div>
  );
}