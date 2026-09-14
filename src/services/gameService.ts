import { apiClient } from "@/services/apiClient";
import { FilterParams, Game } from "@/types/Game";
import { validateGamePayload } from "@/utils/helper";
import { isValidId } from "@/utils/validation";

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

export async function getGameById(id: string): Promise<Game | null> {
  if (!isValidId(id)) return null;

  const response = await apiClient.get<Game>(`/games/${id}`);
  return response.data;
}

export async function createGame(gameData: Partial<Game>): Promise<Game> {
  validateGamePayload(gameData);

  const response = await apiClient.post<Game>("/games", gameData);
  return response.data;
}

export async function updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
  if (!isValidId(id)) {
    throw new Error("A valid game id is required");
  }
  validateGamePayload(gameData);

  const response = await apiClient.put<Game>(`/games/${id}`, gameData);
  return response.data;
}

export async function deleteGame(id: string): Promise<{ success: boolean; id: string }> {
  if (!isValidId(id)) {
    throw new Error("A valid game id is required");
  }

  const response = await apiClient.delete<{ success: boolean; id: string }>(`/games/${id}`);
  return response.data;
}