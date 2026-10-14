import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getObjectives,
  addObjective,
  updateObjective,
  completeObjective,
  reopenObjective,
  deleteObjective,
  reorderObjectives,
} from "@/services/objectiveService";
import { GAME_QUERY_KEYS } from "@/hooks/useGames";

export const OBJECTIVE_QUERY_KEYS = {
  list: (gameId: string | undefined) => ["objectives", gameId] as const,
};

export function useObjectivesQuery(gameId: string | undefined) {
  return useQuery({
    queryKey: OBJECTIVE_QUERY_KEYS.list(gameId),
    queryFn: () => getObjectives(gameId!),
    enabled: !!gameId,
  });
}

export function useAddObjectiveMutation(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (label: string) => addObjective(gameId, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

export function useUpdateObjectiveMutation(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ objectiveId, label, position }: { objectiveId: string; label: string; position?: number }) =>
      updateObjective(gameId, objectiveId, label, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

export function useToggleObjectiveMutation(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ objectiveId, completed }: { objectiveId: string; completed: boolean }) =>
      completed ? reopenObjective(gameId, objectiveId) : completeObjective(gameId, objectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

export function useDeleteObjectiveMutation(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (objectiveId: string) => deleteObjective(gameId, objectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

export function useReorderObjectivesMutation(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (objectiveIds: string[]) => reorderObjectives(gameId, objectiveIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(gameId) });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

