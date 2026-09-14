import { Game } from "@/types/Game";

export function validateGamePayload(game: Partial<Game>): void {
  if (game.title !== undefined && !game.title.trim()) {
    throw new Error("Game title cannot be empty");
  }
  if (
    game.rating !== undefined &&
    (game.rating < 0 || game.rating > 10)
  ) {
    throw new Error("Game rating must be between 0 and 10");
  }
}