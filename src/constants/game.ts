export enum GameStatus {
  UNPLAYED = "UNPLAYED",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
  ABANDONED = "ABANDONED",
}

export enum Platform {
  STEAM = "STEAM",
  EPIC = "EPIC",
  GOG = "GOG",
  XBOX = "XBOX",
  PLAYSTATION = "PLAYSTATION",
  OTHER = "OTHER",
}


export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatus.UNPLAYED]: "Unplayed",
  [GameStatus.PLAYING]: "Playing",
  [GameStatus.FINISHED]: "Finished",
  [GameStatus.ABANDONED]: "Abandoned",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.STEAM]: "Steam",
  [Platform.EPIC]: "Epic Games",
  [Platform.GOG]: "GOG",
  [Platform.XBOX]: "Xbox",
  [Platform.PLAYSTATION]: "PlayStation",
  [Platform.OTHER]: "Other",
};

export const STATUS_FORM_OPTIONS = Object.values(GameStatus).map((status) => ({
  value: status,
  label: GAME_STATUS_LABELS[status],
}));

export const PLATFORM_FORM_OPTIONS = Object.values(Platform).map((platform) => ({
  value: platform,
  label: PLATFORM_LABELS[platform],
}));

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  ...STATUS_FORM_OPTIONS,
];

export const PLATFORM_FILTER_OPTIONS = [
  { value: "ALL", label: "All Platforms" },
  ...PLATFORM_FORM_OPTIONS,
];

export const PROGRESS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Progress" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];
