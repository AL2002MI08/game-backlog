import { apiClient } from "@/services/apiClient"
import { FilterParams, Game } from "@/types/game";
import { stripRatingIfUnplayed } from "@/utils/game";
import { isValidId, validateGamePayload } from "@/utils/validation";


export async function getGames(params?: FilterParams): Promise<Game[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) {
    queryParams.set("search", params.search.trim());
  }
  if (params?.status && params.status !== "ALL") {
    queryParams.set("status", params.status);
  }

  const url = queryParams.toString() ? `/games?${queryParams.toString()}` : "/games";
  const response = await apiClient.get<Game[]>(url);
  return response.data;
}

export async function getGameById(id: string | number): Promise<Game | null> {
  if (!isValidId(id)) return null;

  const response = await apiClient.get<Game>(`/games/${id}`);
  return response.data;
}

export async function createGame(gameData: Partial<Game>): Promise<Game> {
  const payload = stripRatingIfUnplayed(gameData);
  validateGamePayload(payload);

  const response = await apiClient.post<Game>("/games", payload);
  return response.data;
}

export async function updateGame(id: string | number, gameData: Partial<Game>): Promise<Game> {
  if (!isValidId(id)) {
    throw new Error("A valid game id is required");
  }
  const payload = stripRatingIfUnplayed(gameData);
  validateGamePayload(payload);

  const response = await apiClient.put<Game>(`/games/${id}`, payload);
  return response.data;
}

export async function deleteGame(id: string | number): Promise<{ success: boolean; id: string }> {
  if (!isValidId(id)) {
    throw new Error("A valid game id is required");
  }

  const response = await apiClient.delete<{ success: boolean; id: string }>(`/games/${id}`);
  return response.data;
}