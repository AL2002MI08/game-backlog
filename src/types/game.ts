import { GameStatus, Platform } from "@/constants/game";

export type FilterStatus = GameStatus | "ALL"

export interface FilterParams {
  search?: string;
  status?: FilterStatus
}

export type GameFilterParams = FilterParams;

export interface GameObjective {
  id: string;
  title: string;
  completed: boolean;
}

export interface Game {
  id: string;
  title: string;
  platform?: Platform;
  platforms?: Platform[];
  status: GameStatus;
  rating?: number;     
  notes?: string; 
  coverImage?: string;
  objectives?: GameObjective[];
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;         
  updatedAt?: string;         
}

