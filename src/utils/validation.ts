import { Game } from "@/types/game";

export function validateGamePayload(game: Partial<Game>): void {
    if (game.title !== undefined && !game.title.trim()) {
        throw new Error("Game title cannot be empty");
    }
    if (
        game.rating !== undefined &&
        game.rating !== null &&
        (!Number.isInteger(game.rating) || game.rating < 1 || game.rating > 10)
    ) {
        throw new Error("Game rating must be a whole number between 1 and 10");
    }
}

export function isValidId(id: string | number | undefined | null): boolean {
  if (id === undefined || id === null) return false;
  return String(id).trim().length > 0;
}
