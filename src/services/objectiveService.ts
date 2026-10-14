import { Objective } from "@/types/game";
import { apiClient } from "./apiClient";

export async function getObjectives(gameId: string): Promise<Objective[]> {
  const response = await apiClient.get<Objective[]>(`/games/${gameId}/objectives`);
  return response.data;
}

export async function addObjective(gameId: string, label: string, position?: number): Promise<Objective> {
  const response = await apiClient.post<Objective>(`/games/${gameId}/objectives`, { label, position });
  return response.data;
}

export async function updateObjective(gameId: string, objectiveId: string, label: string, position?: number): Promise<Objective> {
  const response = await apiClient.put<Objective>(`/games/${gameId}/objectives/${objectiveId}`, { label, position });
  return response.data;
}

export async function completeObjective(gameId: string, objectiveId: string): Promise<Objective> {
  const response = await apiClient.patch<Objective>(`/games/${gameId}/objectives/${objectiveId}/complete`);
  return response.data;
}

export async function reopenObjective(gameId: string, objectiveId: string): Promise<Objective> {
  const response = await apiClient.patch<Objective>(`/games/${gameId}/objectives/${objectiveId}/reopen`);
  return response.data;
}

export async function reorderObjectives(gameId: string, objectiveIds: string[]): Promise<Objective[]> {
  const response = await apiClient.put<Objective[]>(`/games/${gameId}/objectives/order`, { objectiveIds });
  return response.data;
}

export async function deleteObjective(gameId: string, objectiveId: string): Promise<void> {
  await apiClient.delete(`/games/${gameId}/objectives/${objectiveId}`);
}
