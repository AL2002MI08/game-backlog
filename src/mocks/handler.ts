import { http, HttpResponse } from "msw";
import { GameStatus, Platform } from "@/constants/game";
import { Game } from "@/types/game";
import { mockGames } from "@/mocks/mockGames";

export const handlers = [

  http.get('/api/games', ({ request }) => {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search')?.toLowerCase();
      const status = url.searchParams.get('status');

      let result = [...mockGames];

      if (search) {
        result = result.filter((game) =>
          game.title.toLowerCase().includes(search) ||
          (game.notes && game.notes.toLowerCase().includes(search))
        );
      }

      if (status && status !== "ALL") {
        result = result.filter((game) => game.status === status);
      }

      return HttpResponse.json(result);
    } catch (e) {
      console.error('Error in GET /api/games handler:', e);
      return HttpResponse.json([]);
    }
  }),

  http.get('/api/games/:id', ({ params }) => {
    try {
      const { id } = params;
      const game = mockGames.find((g) => String(g.id) === String(id));

      if (!game) {
        return new HttpResponse(null, { status: 404, statusText: "Game not found" });
      }

      return HttpResponse.json(game);
    } catch (e) {
      console.error('Error in GET /api/games/:id handler:', e);
      return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
    }
  }),

  http.post('/api/games', async ({ request }) => {
    try {
      const body = (await request.json()) as Partial<Game>;
      const newId = String(
        mockGames.length > 0
          ? Math.max(...mockGames.map((g) => Number(g.id) || 0)) + 1
          : 1
      );
      const now = new Date().toISOString();

      const resolvedStatus = body.status || GameStatus.UNPLAYED;
      const newGame: Game = {
        id: newId,
        title: body.title || "Untitled Game",
        platform: body.platform || Platform.OTHER,
        platforms: body.platforms || (body.platform ? [body.platform] : [Platform.OTHER]),
        status: resolvedStatus,
        rating: resolvedStatus === GameStatus.UNPLAYED ? undefined : body.rating,
        notes: body.notes,
        coverImage: body.coverImage,
        objectives: body.objectives || [],
        startedAt: body.startedAt,
        finishedAt: body.finishedAt,
        createdAt: now,
        updatedAt: now,
      };

      mockGames.unshift(newGame);
      return HttpResponse.json(newGame, { status: 201 });
    } catch (e) {
      console.error('Error in POST /api/games handler:', e);
      return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
    }
  }),

  http.put("/api/games/:id", async ({ params, request }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as any;
      const index = mockGames.findIndex((g) => String(g.id) === String(id));
      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }
      const merged: Game = { ...mockGames[index], ...body };
      
      if (merged.status === GameStatus.UNPLAYED) {
        delete merged.rating;
      }
      mockGames[index] = merged;
      return HttpResponse.json(mockGames[index]);
    } catch (e) {
      console.error('Error in PUT /api/games/:id handler:', e);
      return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
    }
  }),

  http.delete('/api/games/:id', ({ params }) => {
    try {
      const { id } = params;
      const index = mockGames.findIndex((g) => String(g.id) === String(id));

      if (index === -1) {
        return new HttpResponse(null, { status: 404, statusText: "Game not found" });
      }

      mockGames.splice(index, 1);
      return HttpResponse.json({ success: true, id: String(id) });
    } catch (e) {
      console.error('Error in DELETE /api/games/:id handler:', e);
      return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
    }
  })
];

