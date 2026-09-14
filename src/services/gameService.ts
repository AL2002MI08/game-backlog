import { apiClient } from "@/services/apiClient";
import { FilterParams, Game } from "@/types/Game";

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

