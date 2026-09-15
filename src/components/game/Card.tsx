import { useState } from "react";
import { Gamepad2, Star } from "lucide-react";
import { getActivePlatform, getGameProgress } from "@/utils/game";
import { Game } from "@/types/game";
import { GameStatus } from "@/constants/game";
import { PlatformBadge, StatusBadge } from "@/components/game/StatusBadge";

interface CardCoverProps {
  coverImage?: string;
  title: string;
  rating?: number;
}

interface CardProps {
  game: Game;
  onClick?: () => void;
}

interface CardInfoProps {
  game: Game;
}

function CardCover({ coverImage, title, rating }: CardCoverProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !coverImage || imageError;

  return (
    <div className="relative w-full h-full bg-slate-100 dark:bg-[#050811] overflow-hidden grid place-items-center">
      {!showFallback ? (
        <img
          src={coverImage}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full p-6 text-center grid grid-rows-[auto_1fr] place-items-center gap-3">
          <span className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            COVER UNAVAILABLE
          </span>
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 group-hover:border-teal-500/40 transition-colors shadow-xs grid place-items-center">
            <Gamepad2 className="w-8 h-8" />
          </div>
        </div>
      )}

      {rating !== undefined && (
        <div className="absolute top-3 right-3 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{rating}/10</span>
        </div>
      )}
    </div>
  );
}

function CardInfo({ game }: CardInfoProps) {
  const activePlatform = getActivePlatform(game);
  const { total, completed, percent } = getGameProgress(game);

  return (
    <div className="p-4 grid grid-rows-[auto_auto_1fr_auto] gap-2">
      <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1 text-center">
        {game.title}
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <PlatformBadge platform={activePlatform} />
        <StatusBadge status={game.status} />
      </div>

      {total > 0 && (
        <div className="pt-2 mt-auto grid grid-rows-2 gap-1">
          <div className="grid grid-cols-[1fr_auto] text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {completed}/{total} Objectives
            </span>
            <span className="text-teal-600 dark:text-teal-400 font-bold text-[11px]">{percent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-300/40 dark:border-slate-700/40">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-teal-500" : "bg-slate-400 dark:bg-slate-600"
              }`}
              style={{ width: `${percent}%` }}
            />
        </div>
      </div>)}
      
    </div>
  );
}

export default function Card({ game, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      className="group relative cursor-pointer select-none rounded-2xl bg-white dark:bg-[#090e1c] hover:bg-slate-50 dark:hover:bg-[#0d152a] border-2 border-white dark:border-[#18233c] hover:border-teal-500/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-slate-200/80 dark:shadow-teal-950/40 overflow-hidden grid grid-rows-[280px_auto]"
    >
      <CardCover
        coverImage={game.coverImage}
        title={game.title}
        rating={game.status !== GameStatus.UNPLAYED ? game.rating : undefined}
      />
      <CardInfo game={game} />
    </div>
  );
}