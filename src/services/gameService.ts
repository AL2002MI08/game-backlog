import { apiClient } from "@/services/apiClient";
import { FilterParams, Game } from "@/types/game";

interface PagedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export async function getGames(params?: FilterParams): Promise<Game[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set("search", params.search.trim());
  if (params?.status && params.status !== "ALL") queryParams.set("status", params.status);

  const url = queryParams.toString() ? `/games?${queryParams.toString()}` : "/games";
  const response = await apiClient.get<PagedResponse<Game>>(url);
  return response.data.items;
}

export async function getGameById(id: string): Promise<Game> {
  const response = await apiClient.get<Game>(`/games/${id}`);
  return response.data;
}

export async function createGame(gameData: Partial<Game>): Promise<Game> {

  const response = await apiClient.post<Game>("/games", gameData);
  return response.data;
}

export async function updateGame(id: string, gameData: Partial<Game>): Promise<Game> {

  const payload = Object.fromEntries(
    Object.entries(gameData).filter(([key, value]) => {
      if (value === undefined || value === null) return false;
      if (key === 'coverImage' && value === '') return false;
      return true;
    })
  );

  const response = await apiClient.put<Game>(`/games/${id}`, payload);
  return response.data;
}

export async function updateGameStatus(id: string, status: string): Promise<Game> {
  const response = await apiClient.patch<Game>(`/games/${id}/status`, { status });
  return response.data;
}

export async function deleteGame(id: string): Promise<void> {
  await apiClient.delete(`/games/${id}`);
}