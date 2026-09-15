import { GameStatus, Platform } from "@/constants/game";
import { Game, GameObjective } from "@/types/game";

export type ProgressCategory = "ALL" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

/**
 * Builds a new, unticked objective from a title. Shared by the Add/Edit form
 * and the Game Detail checklist so both "add objective" entry points produce
 * identically-shaped objectives.
 */
export function createObjective(title: string): GameObjective {
  return {
    id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: title.trim(),
    completed: false,
  };
}

/**
 * Calculates objective completion stats and overall progress percentage.
 */
export function getGameProgress(game: Game) {
  const total = game.objectives?.length || 0;
  const completed = game.objectives?.filter((objective) => objective.completed).length || 0;

  let percent = 0;
  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  let category: ProgressCategory = "NOT_STARTED";
  if (total > 0 && percent === 100) {
    category = "COMPLETED";
  } else if (total > 0 && percent > 0) {
    category = "IN_PROGRESS";
  }

  return { total, completed, percent, category };
}

/**
 * Returns the primary platform for display.
 */
export function getActivePlatform(game: Game): Platform {
  return game.platform || (game.platforms && game.platforms[0]) || Platform.OTHER;
}

/**
 * Returns Tailwind badge classes for GameStatus supporting both Light & Dark modes.
 */
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

/**
 * Returns Tailwind badge classes for Platform supporting both Light & Dark modes.
 */
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