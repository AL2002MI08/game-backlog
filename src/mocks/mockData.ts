import { GameStatus, Platform } from "@/constants/game";
import { Game } from "@/types/game";
import { UserProfile } from "@/services/authService";

export interface MockUser extends UserProfile {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "1-2",
    email: "gamer1@gmail.com",
    name: "Noob",
    password: "Password123",
  },
  {
    id: "1-3",
    email: "gamer2@yahoo.com",
    name: "Fisher",
    password: "Password456",
  },
];

export const MOCK_GAMES: Game[] = [
  {
    id: "1",
    title: "FIFA 13",
    platforms: [Platform.PLAYSTATION, Platform.XBOX, Platform.STEAM],
    status: GameStatus.PLAYING,
    rating: 8,
    notes: "Classic PS2/PS3 football gameplay with great soundtrack.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x9q.webp",
    objectives: [
      { id: "1-1", title: "Complete Career Mode Season", completed: true },
      { id: "1-2", title: "Win Champions League Trophy", completed: false },
      { id: "1-3", title: "Score bicycle kick in Ultimate Team", completed: true },
      { id: "1-4", title: "Unlock 50 Skill Challenges", completed: false }
    ],
    startedAt: "2026-02-10",
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Naruto Shippuden - Ultimate Ninja 5",
    platforms: [Platform.PLAYSTATION],
    status: GameStatus.FINISHED,
    rating: 9,
    notes: "Epic Master Mode with full Shippuden storyline up to Sasuke retrieval.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co204m.webp",
    objectives: [
      { id: "2-1", title: "Defeat Deidara & Sasori", completed: true },
      { id: "2-2", title: "Unlock all 62 playable characters", completed: true },
      { id: "2-3", title: "Complete Master Mode Storyline", completed: true },
      { id: "2-4", title: "Clear 100-floor Survival challenge", completed: true }
    ],
    startedAt: "2023-05-15",
    finishedAt: "2023-08-20",
    createdAt: "2023-05-15T09:00:00Z",
    updatedAt: "2023-08-20T12:00:00Z",
  },
  {
    id: "3",
    title: "Grand Theft Auto: San Andreas",
    platforms: [Platform.PLAYSTATION, Platform.STEAM, Platform.XBOX],
    status: GameStatus.PLAYING,
    rating: 10,
    notes: "Ah shit, here we go again. Greatest open world sandbox of the PS2 era.",
    coverImage: "",
    objectives: [
      { id: "3-1", title: "Complete Los Santos Intro missions", completed: true },
      { id: "3-2", title: "Take over all gang territories", completed: false },
      { id: "3-3", title: "Complete Flight School with gold medals", completed: false },
      { id: "3-4", title: "Reach 100% Game Completion", completed: false }
    ],
    startedAt: "2024-02-01",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T14:00:00Z",
  },
  {
    id: "4",
    title: "Black",
    platforms: [Platform.PLAYSTATION, Platform.XBOX],
    status: GameStatus.FINISHED,
    rating: 8,
    notes: "Criterion's visceral gunplay masterpiece with destructible environments.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wde.webp",
    objectives: [
      { id: "4-1", title: "Complete Trenches campaign", completed: true },
      { id: "4-2", title: "Finish game on Hard difficulty", completed: true },
      { id: "4-3", title: "Unlock Silver weapons bonus", completed: true }
    ],
    startedAt: "2023-11-01",
    finishedAt: "2023-11-12",
    createdAt: "2023-11-01T08:00:00Z",
    updatedAt: "2023-11-12T08:00:00Z",
  },
  {
    id: "5",
    title: "Elden Ring",
    platforms: [Platform.STEAM, Platform.PLAYSTATION, Platform.XBOX],
    status: GameStatus.PLAYING,
    rating: 10,
    notes: "Lands Between exploration. Hard but immensely rewarding.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
    objectives: [
      { id: "5-1", title: "Defeat Margit and Godrick", completed: true },
      { id: "5-2", title: "Defeat Starscourge Radahn", completed: true },
      { id: "5-3", title: "Defeat Malenia, Blade of Miquella", completed: false },
      { id: "5-4", title: "Claim Elden Lord Ending", completed: false }
    ],
    startedAt: "2024-06-01",
    createdAt: "2024-06-01T09:00:00Z",
    updatedAt: "2024-09-11T12:00:00Z",
  },
  {
    id: "6",
    title: "The Witcher 3: Wild Hunt",
    platforms: [Platform.GOG, Platform.STEAM, Platform.PLAYSTATION, Platform.XBOX],
    status: GameStatus.FINISHED,
    rating: 10,
    notes: "One of the best RPGs ever made. Blood and Wine was sensational.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp",
    objectives: [
      { id: "6-1", title: "Find Ciri in the Isle of Mists", completed: true },
      { id: "6-2", title: "Defeat Eredin & Wild Hunt", completed: true },
      { id: "6-3", title: "Complete Hearts of Stone expansion", completed: true },
      { id: "6-4", title: "Complete Blood and Wine expansion", completed: true }
    ],
    startedAt: "2023-01-10",
    finishedAt: "2023-04-02",
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2023-04-02T18:30:00Z",
  },
  {
    id: "7",
    title: "Cyberpunk 2077",
    platforms: [Platform.EPIC, Platform.STEAM, Platform.PLAYSTATION, Platform.XBOX],
    status: GameStatus.ABANDONED,
    rating: 6,
    notes: "Night City has great visuals, but paused halfway through.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mjs.webp",
    objectives: [
      { id: "7-1", title: "The Heist at Konpeki Plaza", completed: true },
      { id: "7-2", title: "Meet Panam Palmer in Badlands", completed: true },
      { id: "7-3", title: "Phantom Liberty DLC missions", completed: false }
    ],
    startedAt: "2022-12-25",
    createdAt: "2022-12-25T00:00:00Z",
    updatedAt: "2023-02-10T14:00:00Z",
  },
  {
    id: "8",
    title: "Hollow Knight",
    platforms: [Platform.STEAM, Platform.PLAYSTATION, Platform.XBOX, Platform.OTHER],
    status: GameStatus.UNPLAYED,
    notes: "Waiting in backlog for the next vacation period.",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co93bc.webp",
    objectives: [
      { id: "8-1", title: "Obtain Mothwing Cloak (Dash)", completed: false },
      { id: "8-2", title: "Awaken the Dreamers", completed: false },
      { id: "8-3", title: "Complete the Pantheon of Hallownest", completed: false }
    ],
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-05T08:00:00Z",
  }
];
