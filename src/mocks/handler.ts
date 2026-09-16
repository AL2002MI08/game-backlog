import { http, HttpResponse } from "msw";
import { GameStatus } from "@/constants/game";
import { Game } from "@/types/game";
import { MOCK_GAMES, MOCK_USERS } from "@/mocks/mockData";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

function getGames(): Game[] {
  const raw = localStorage.getItem("mock_games");
  if (!raw) {
    localStorage.setItem("mock_games", JSON.stringify(MOCK_GAMES));
    return MOCK_GAMES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return MOCK_GAMES;
  }
}

function saveGames(games: Game[]): void {
  localStorage.setItem("mock_games", JSON.stringify(games));
}

export const handlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email?.toLowerCase() && u.password === password
    );

    if (found) {
      return HttpResponse.json({ token: `token-${found.id}`, user: { id: found.id, email: found.email, name: found.name } });
    }
    return new HttpResponse(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
  }),

  http.get(`${BASE}/games`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const status = url.searchParams.get("status");

    let list = getGames();
    if (search) {
      list = list.filter((g) => g.title.toLowerCase().includes(search) || g.notes?.toLowerCase().includes(search));
    }
    if (status && status !== "ALL") {
      list = list.filter((g) => g.status === status);
    }
    return HttpResponse.json(list);
  }),

  http.get(`${BASE}/games/:id`, ({ params }) => {
    const game = getGames().find((g) => String(g.id) === String(params.id));
    return game ? HttpResponse.json(game) : new HttpResponse(null, { status: 404 });
  }),

  http.post(`${BASE}/games`, async ({ request }) => {
    const body = (await request.json()) as Partial<Game>;
    const list = getGames();
    const newId = String(list.length > 0 ? Math.max(...list.map((g) => Number(g.id) || 0)) + 1 : 1);
    const now = new Date().toISOString();

    const newGame: Game = {
      id: newId,
      title: body.title || "Untitled Game",
      status: body.status || GameStatus.UNPLAYED,
      platforms: body.platforms || [],
      rating: body.status === GameStatus.UNPLAYED ? undefined : body.rating,
      notes: body.notes,
      coverImage: body.coverImage,
      objectives: body.objectives || [],
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newGame);
    saveGames(list);
    return HttpResponse.json(newGame, { status: 201 });
  }),

  http.put(`${BASE}/games/:id`, async ({ params, request }) => {
    const body = (await request.json()) as any;
    const list = getGames();
    const index = list.findIndex((g) => String(g.id) === String(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });

    list[index] = { ...list[index], ...body };
    saveGames(list);
    return HttpResponse.json(list[index]);
  }),

  http.delete(`${BASE}/games/:id`, ({ params }) => {
    const list = getGames();
    const nextList = list.filter((g) => String(g.id) !== String(params.id));
    if (nextList.length === list.length) return new HttpResponse(null, { status: 404 });

    saveGames(nextList);
    return HttpResponse.json({ success: true, id: String(params.id) });
  }),
];
