import { Game } from "@/types/game";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Star, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { getActivePlatform } from "@/utils/game";
import { GameStatus } from "@/constants/game";
import { PlatformBadge, StatusBadge } from "@/components/game/StatusBadge";
import Button from "@/components/ui/Button";
import { RouteLinks } from "@/constants/routes";

interface GameDetailBannerProps {
  game: Game;
  onOpenDelete: () => void;
  onOpenEdit?: () => void;
}

export default function GameDetailBanner({ game, onOpenDelete, onOpenEdit }: GameDetailBannerProps) {
  const [imageError, setImageError] = useState(false);
  const activePlatform = getActivePlatform(game);
  const showFallback = !game.coverImage || imageError;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Link to={RouteLinks.GameOverview} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
        <div className="flex items-center gap-2">
          {onOpenEdit && (
            <Button variant="secondary" size="sm" onClick={onOpenEdit}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          )}
          {onOpenDelete && (
            <Button variant="danger" size="sm" onClick={onOpenDelete}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#18233c] overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
          <div className="w-full h-72 rounded-2xl bg-slate-100 dark:bg-[#050811] overflow-hidden border border-slate-200 dark:border-[#18233c] flex items-center justify-center relative shadow-xs">
            {!showFallback ? (
              <img src={game.coverImage} alt={game.title} onError={() => setImageError(true)} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 space-y-3">
                <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">COVER UNAVAILABLE</span>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8" />
                </div>
              </div>
            )}
            {game.status !== GameStatus.UNPLAYED && game.rating !== undefined && (
              <div className="absolute top-3 right-3 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/40 text-amber-400 font-black text-xs flex items-center gap-1 shadow-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{game.rating}/10</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <PlatformBadge platform={activePlatform} size="md" />
                <StatusBadge status={game.status} size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{game.title}</h1>
              {game.notes && (
                <div className="p-5 bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-[#1c2945] text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  <span className="text-md font-bold uppercase tracking-wider text-slate-400 block mb-1">Review</span>
                  "{game.notes}"
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-[#18233c] text-xs text-slate-500">
              {game.startedAt && <div><span className="block text-slate-400">Started</span><span className="text-slate-800 dark:text-slate-200 font-semibold">{game.startedAt}</span></div>}
              {game.finishedAt && <div><span className="block text-slate-400">Finished</span><span className="text-slate-800 dark:text-slate-200 font-semibold">{game.finishedAt}</span></div>}
              {game.createdAt && <div><span className="block text-slate-400">Added</span><span className="text-slate-800 dark:text-slate-200 font-semibold">{game.createdAt.split("T")[0]}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
