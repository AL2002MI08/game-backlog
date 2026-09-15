import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "@/services/gameService";
import { Game, GameFilterParams } from "@/types/game";

export const GAME_QUERY_KEYS = {
  all: ["games"] as const,
  list: (params?: GameFilterParams) => ["games", "list", params] as const,
  detail: (id: string | undefined) => ["games", "detail", id] as const,
};

export function useGamesQuery(params?: GameFilterParams) {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.list(params),
    queryFn: () => getGames(params),
  });
}


export function useGameDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.detail(id),
    queryFn: () => getGameById(id!),
    enabled: !!id,
  });
}

export function useCreateGameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGame: Partial<Game>) => createGame(newGame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}

export function useUpdateGameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) => updateGame(id, data),
    onSuccess: (updatedGame) => {
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(updatedGame.id) });
    },
  });
}

export function useDeleteGameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.all });
    },
  });
}
