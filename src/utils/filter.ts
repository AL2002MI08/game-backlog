import { Platform } from "@/constants/game";
import { filterOptions, Game } from "@/types/game";
import { getGameProgress } from "@/utils/game";

export function filterGames(games: Game[], criteria: filterOptions): Game[] {
    const normalizedSearch = criteria.search.trim().toLowerCase();

    return games.filter((game) => {
        if (normalizedSearch) {
            const titleMatches = game.title.toLowerCase().includes(normalizedSearch);
            const notesMatches = game.notes?.toLowerCase().includes(normalizedSearch);
            if (!titleMatches && !notesMatches) return false;
        }

        if (criteria.platform !== "ALL" && !game.platforms.includes(criteria.platform as Platform)) {
            return false;
        }

        if (criteria.status !== "ALL" && game.status !== criteria.status) {
            return false;
        }

        if (criteria.progress !== "ALL") {
            const { category } = getGameProgress(game);
            if (category !== criteria.progress) return false;
        }

        return true;
    });
}
