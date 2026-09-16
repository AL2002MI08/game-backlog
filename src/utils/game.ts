import { GameStatus, Platform } from "@/constants/game";
import { Game, GameObjective, GameProgress, ProgressCategory } from "@/types/game";

function getProgressCategory(total: number, percent: number): ProgressCategory {
  if (total === 0) return "NOT_STARTED";
  if (percent === 100) return "COMPLETED";
  if (percent > 0) return "IN_PROGRESS";
  return "NOT_STARTED";
}
export function createObjective(title: string): GameObjective {
  return {
    id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: title.trim(),
    completed: false,
  };
}

export function getGameProgress(game: Game): GameProgress {
  const objectives = game.objectives ?? [];
  const total = objectives.length;
  const completed = objectives.reduce(
    (count, objective) => (objective.completed ? count + 1 : count),
    0
  );

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const category = getProgressCategory(total, percent);

  return { total, completed, percent, category };
}


export function stripRatingIfUnplayed<T extends Partial<Game>>(gameData: T): T {
  if (gameData.status === GameStatus.UNPLAYED && gameData.rating !== undefined) {
    const { rating, ...rest } = gameData;
    return rest as T;
  }
  return gameData;
}


export function getActivePlatform(game: Game): Platform {
  return game.platforms[0] ?? Platform.OTHER;
}

export function getStatusBadgeStyle(status: GameStatus): string {
  switch (status) {
    case GameStatus.FINISHED:
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case GameStatus.PLAYING:
      return "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30";
    case GameStatus.UNPLAYED:
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";
    case GameStatus.ABANDONED:
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-200 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600/30";
  }
}

export function getPlatformBadgeStyle(platform?: Platform): string {
  switch (platform) {
    case Platform.PLAYSTATION:
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case Platform.XBOX:
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case Platform.STEAM:
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30";
    case Platform.EPIC:
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30";
    case Platform.GOG:
      return "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30";
    default:
      return "bg-slate-200 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600/30";
  }
}