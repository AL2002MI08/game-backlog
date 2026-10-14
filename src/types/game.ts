import { GameStatus, Platform } from "@/constants/game";

export type FilterStatus = GameStatus | "ALL"

export type ProgressCategory = "ALL" | "NO_OBJECTIVES" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export interface GameProgress {
  total: number;
  completed: number;
  percent: number | null;
  category: ProgressCategory;
}

export interface filterOptions {
    search: string;
    platform: string;
    status: string;
    progress: ProgressCategory;
}

export interface FilterParams {
  search?: string;
  status?: FilterStatus
}

export type GameFilterParams = FilterParams;

export interface GameObjective {
  id: string;
  label: string;
  completed: boolean;
  gameId?: string;
  position?: number;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type Objective = GameObjective;

export interface GameProgressSummary {
  total: number;
  completed: number;
  percentage: number | null;
}

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  status: GameStatus;
  rating?: number | null;     
  notes?: string; 
  coverImage?: string;
  objectives?: GameObjective[];
  progress?: GameProgressSummary;
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;         
  updatedAt?: string;         
}